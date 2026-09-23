const cds = require('@sap/cds');
const { all } = require('@sap/cds/lib/compile/resolve');
const { SELECT, UPDATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {
    const { employee, course, enrollment, assesment_det, feedback, department, traineeAss } = this.entities;

    //!Enroll before hook


    this.before('enroll', async (req) => {
        const { employeeID, courseID } = req.data;
        console.log(employeeID, courseID);

        const emp = await SELECT.one.from(employee).where({ ID: employeeID });
        const crs = await SELECT.one.from(course).where({ ID: courseID });

        console.log(emp);
        console.log(crs);



        if (!emp) {
            req.error(404, 'Employee not Found');
            return;
        }
        if (!crs) {
            req.error(404, 'Course not Found');
            return;

        }

        const enrl = await SELECT.from(enrollment).where({ Employee_ID: employeeID, Course_ID: courseID, Status: 'ACTIVE' });
        if (enrl.length > 0) {
            req.error(400, 'Employee is already enrolled in this course');
            return;
        }
        const allEnrl = await SELECT.from(enrollment).where({ Course_ID: courseID })
        console.log(crs.MaxEnrollments);
        console.log(allEnrl.length);



        if (allEnrl.length >= crs.MaxEnrollments) {
            req.error(400, "Sorry 😕, No seats available")
        }
    })

    // !  Enroll ON Hook


    this.on('enroll', async (req) => {
        const { ID, employeeID, courseID } = req.data;

        const emp = await SELECT.one.from(employee).where({ ID: employeeID });
        const crs = await SELECT.one.from(course).where({ ID: courseID });

        console.log(emp);
        console.log(crs);




        const EnrollmentDate = new Date();
        const status = 'ACTIVE';
        console.log(EnrollmentDate);
        console.log(crs.Duration_Days);


        const endingDate = new Date();
        endingDate.setDate(
            endingDate.getDate() + crs.Duration_Days
        );
        console.log(endingDate);
        console.log(EnrollmentDate);

        const newEnrollment = {
            ID: ID,
            Employee_ID: employeeID,
            Course_ID: courseID,
            Status_status: status,
            EnrollmentDate: EnrollmentDate,
            CompletionDate: endingDate

        }
        await INSERT.into(enrollment).entries(newEnrollment);
        req.info("Enrollment Successful");
        return;
    })
    this.before('enrollTest', async (req) => {
        const { enrollmentID } = req.data;
        console.log("This is before hook");

        console.log(enrollmentID);

        const enrlData = await SELECT.one.from(enrollment).where({ ID: enrollmentID });
        console.log(enrlData);
        const today_Date = new Date();
        console.log(today_Date);

        const completionDate = new Date(enrlData.CompletionDate);
        console.log(completionDate);

        if (enrlData.Status_status == 'REVOKED') {
            req.error("Sorry, You already revoked this Course so you unable to attend the test ")
        }

        if (today_Date >= completionDate) {
            req.info("Congratulations 🎊🎉, You completed the Course");
            return;
        } else {
            req.error("Sorry, Please complete the Course First");
        }

    })


    // ! Enroll Test ON Hook


 this.on('enrollTest', async (req) => {
        const { enrollmentID } = req.data;
        console.log("This is on hook");

        const enrlData = await SELECT.from(enrollment);
        console.log(enrlData);

        const updateData = await UPDATE(enrollment).set({ Status_status: 'COMPLETED' }).where({ ID: enrollmentID });


    })


    // ! Complete Before Hook


    this.before('complete', async (req) => {

        console.log("Before Hook");

        const { enrollmentID, score } = req.data;
        const data = await SELECT.one.from(traineeAss).where({ Enrollment_ID: enrollmentID })
        if (data) {
            if (data.Result == 'PASS') {
                req.error("Sorry You already attended the test");
                return;
            }
            else if (data.Result == 'FAIL') {
                req.info("This is 2nd Attempt");
            }
        }
    })

    // ! Complete ON Hook


    this.on('complete', async (req) => {

        console.log("On Hook");

        const { enrollmentID, score } = req.data;

        const enrlData = await SELECT.one.from(enrollment).where({ ID: enrollmentID });

        console.log(enrlData);

        const updateData = await UPDATE(enrollment).set({ Score: score }).where({ ID: enrollmentID })
        console.log(updateData);


    })


    // ! Complete After Hook


    this.after('complete', async (data, req) => {

        console.log("Afer hook");


        const { enrollmentID, score } = req.data;
        console.log(enrollmentID, score);

        const enrlData = await SELECT.one.from(enrollment).where({ ID: enrollmentID });

        console.log(enrlData);

        const Get_AssDetail = await SELECT.one.from(assesment_det).where({ Course_ID: enrlData.Course_ID })
        console.log(Get_AssDetail);

        let res = "";
        if (score >= Get_AssDetail.PassMarks) {
            res = "PASS"
        }
        else {
            res = "FAIL"
        }

        const courseData = await SELECT.one.from(course).where({ ID: enrlData.Course_ID });
        console.log(courseData);

        const expiryDate = new Date();
        expiryDate.setMonth(
            expiryDate.getMonth() + courseData.ValidityMonths
        );

        console.log(expiryDate);
        const expiry_year = expiryDate.toDateString().slice(10);
        console.log("Expiry Year", expiry_year);

        const randomDigit = () => Math.floor(1000 + Math.random() * 9000);
        const certificateNo = `CERT-${expiry_year}-${randomDigit()}`;
        console.log(certificateNo);



        const ass_data = await SELECT.one.from(traineeAss).where({ Enrollment_ID: enrollmentID })
        if (!ass_data) {
            const create_result = {
                ObtainedMarks: score,
                Result: res,
                Enrollment_ID: enrollmentID,
            }

            const create_Ass = await INSERT.into(traineeAss).entries(create_result);
            console.log(create_Ass);

            if (res == 'PASS') {

                const updatesData = await UPDATE(enrollment).set({ Status_status: 'CERTIFIED', CertificateNo: certificateNo, ExpiryDate: expiryDate }).where({ ID: enrollmentID });
            }
            else {
                const updatesData = await UPDATE(enrollment).set({ Status_status: 'FAILED' }).where({ ID: enrollmentID });

            }
        }
        else {

            const create_Ass = await UPDATE(traineeAss).set({ ObtainedMarks: score, Result: res }).where({ Enrollment_ID: enrollmentID });
            console.log(create_Ass);

            if (res == 'PASS') {

                const updatesData = await UPDATE(enrollment).set({ Status_status: 'CERTIFIED', CertificateNo: certificateNo, ExpiryDate: expiryDate }).where({ ID: enrollmentID });
            }
            else {
                const updatesData = await UPDATE(enrollment).set({ Status_status: 'FAILED' }).where({ ID: enrollmentID });

            }
        }



        //     const enrlData = await SELECT.one.from(enrollment).where({ ID: enrollmentID });

        //     const updateData = await UPDATE(enrollment).set({ Status_status: 'CERTIFIED' }).where({ ID: enrollmentID });


    })

    //    !  Revoke ON Hook

    this.on('revoke', async (req) => {
        const { enrollmentID, reason } = req.data;

        const updateData = await UPDATE(enrollment).set({ Reason: reason, Status_status: 'REVOKED' }).where({ ID: enrollmentID })
    })

    // ! GetExpiringCertificates function


    this.on('getExpiringCertificates', async (req) => {

        const { daysAhead } = req.data;

        const today = new Date();
        const futureDate = new Date();

        futureDate.setDate(today.getDate() + daysAhead);
        console.log(futureDate);
        console.log(today);

        console.log(today.getDate() + daysAhead);


        const todayStr = today.toISOString().split('T')[0];  //this method returns date and time as Timestamp cds data type
        const futureDateStr = futureDate.toISOString().split('T')[0];

        console.log(typeof (todayStr));


        const result = await SELECT.from(enrollment)
            .where`
            ExpiryDate >= ${todayStr}
            and ExpiryDate <= ${futureDateStr}
            and Status_status ='CERTIFIED'
        `;

        return result;
    });


    //    ! SubmitFeedback Before Hook

    this.before('submitFeedback', async (req) => {
        const { enrollmentID } = req.data;
        console.log("Before Hook");


        const data = await SELECT.one.from('Enrollments').where({ ID: enrollmentID });
        console.log(data);

        if (data.Status_status != 'CERTIFIED') {
            req.error(404, "Sorry , you did not complete the Course ")
        }
        const feedback_data = await SELECT.one.from('Feedbacks').where({ Enrollment_ID: enrollmentID })
        console.log(feedback_data);
        if (feedback_data) {
            req.error("You already submitted the feedback")
        }

    })


    // ! SubmitFeedback

    
    this.on('submitFeedback', async (req) => {

        console.log("On Hook");

        const { enrollmentID, rating, comments } = req.data;
        console.log(enrollmentID, rating, comments);


        const data = await SELECT.one.from('Enrollments').where({ ID: enrollmentID });
        console.log(data);

        const new_Data = {
            Rating: rating,
            Comments: comments,
            SubmittedAt: new Date(),
            Enrollment_ID: enrollmentID
        }

        const createFeedback = await INSERT.into('Feedbacks').entries(new_Data);
        console.log(createFeedback);


    })
})
