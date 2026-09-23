const cds = require('@sap/cds');
const { data } = require('@sap/cds/lib/dbs/cds-deploy');
module.exports = cds.service.impl(async function () {
    const { Enrollments, course, employee } = this.entities;
    //    ! SubmitFeedback Before Hook

    this.before('submitFeedback', async (req) => {
         const  {enrollmentID}  = req.data
       /*  const enrollmentID = req.params[1]?.ID; */
        console.log("Before Hook");
        console.log(enrollmentID);



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

        const enrl = await SELECT.from(Enrollments).where({ Employee_ID: employeeID, Course_ID: courseID, Status: 'ACTIVE' });
        if (enrl.length > 0) {
            req.error(400, 'Employee is already enrolled in this course');
            return;
        }
        const allEnrl = await SELECT.from(Enrollments).where({ Course_ID: courseID })
        console.log(crs.MaxEnrollments);
        console.log(allEnrl.length);



        if (allEnrl.length >= crs.MaxEnrollments) {
            req.error(400, "Sorry 😕, No seats available")
        }
    })




    // !  Enroll ON Hook


    this.on('enroll', async (req) => {
        const { employeeID, courseID } = req.data;

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
            Employee_ID: employeeID,
            Course_ID: courseID,
            Status_status: status,
            EnrollmentDate: EnrollmentDate,
            CompletionDate: endingDate,
            Criticality: 2

        }
        await INSERT.into(Enrollments).entries(newEnrollment);
        req.info("Enrollment Successful");
        return;
    })

    // ! certificate criticality

    this.after('READ', Enrollments, async (data, req) => {
        const rows = Array.isArray(data) ? data : [data];
        const today = new Date();

        rows.forEach(row => {
            if (!row?.ExpiryDate) return;

            const expiry = new Date(row.ExpiryDate);
            const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

            if (days < 0) {
                row.CertificateCriticality = 1;
            } else if (days <= 30) {
                row.CertificateCriticality = 2;
            } else {
                row.CertificateCriticality = 3;
            }
        }
        )
    })



    this.on('READ', employee, async (req) => {

        return SELECT.from(employee)
            .where(`Email = '${req.user.id}'`)
    })


})