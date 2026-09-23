const cds = require('@sap/cds');
const { all } = require('@sap/cds/lib/compile/resolve');
const { SELECT, UPDATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');
require('dotenv').config();
const axios = require('axios');
const https = require('https');

module.exports = cds.service.impl(async function () {
    const { employee, course, Enrollments, assesment_det, department, traineeAss } = this.entities;

    // ! Enrollment before Hook


    this.before('CREATE', Enrollments, async (req) => {
        console.log("Enrollment Before Hook");

        const { Employee_ID, Course_ID } = req.data;
        console.log(Employee_ID, Course_ID);

        const emp = await SELECT.one.from(employee).where({ ID: Employee_ID });
        console.log("hi");
        const crs = await SELECT.one.from(course).where({ ID: Course_ID });
        console.log("hello")

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

        const enrl = await SELECT.from(Enrollments).where({ Employee_ID: Employee_ID, Course_ID: Course_ID, Status_status: 'ACTIVE' });
        if (enrl.length > 0) {
            req.error(400, 'Employee is already enrolled in this course');
            return;
        }
        const allEnrl = await SELECT.from(Enrollments).where({ Course_ID: Course_ID })
        console.log(crs.MaxEnrollments);
        console.log(allEnrl.length);



        if (allEnrl.length >= crs.MaxEnrollments) {
            req.error(400, "Sorry 😕, No seats available")
        }
    })



    // ! Enrollment On Hook



    this.on('CREATE', Enrollments, async (req, next) => {

        console.log("Enrollment ON Condition");

        const { Employee_ID, Course_ID, EnrollmentDate, Status_status, CompletionDate, } = req.data;

        const emp = await SELECT.one.from(employee).where({ ID: Employee_ID });
        const crs = await SELECT.one.from(course).where({ ID: Course_ID });

        console.log(emp);
        console.log(crs);




        req.data.EnrollmentDate = new Date();
        req.data.Status_status = 'ACTIVE';
        req.data.Criticality = 2;
        console.log(EnrollmentDate);
        console.log(crs.Duration_Days);


        const endingDate = new Date();
        endingDate.setDate(
            endingDate.getDate() + crs.Duration_Days
        );
        console.log(endingDate);
        req.data.CompletionDate = endingDate
        console.log(req.data.EnrollmentDate);
        await next();

        //await INSERT.into(Enrollments).entries(newEnrollment);
        req.info("Enrollment Successful");
    })





    // ! EnrollTest Before Hook
    this.before('enrollTest', async (req) => {
        const { ID } = req.params[0];
        console.log("This is before hook");

        console.log(ID);

        const enrlData = await SELECT.one.from(Enrollments).where({ ID: ID });
        console.log(enrlData);
        const today_Date = new Date();
        console.log(today_Date);

        const completionDate = new Date(enrlData.CompletionDate);
        console.log(completionDate);

        if (enrlData.Status_status == 'REVOKED') {
            req.error("Sorry, You already revoked this Course so you unable to attend the test ")
        }
        if (enrlData.Status_status == 'COMPLETED' || enrlData.Status_status == 'CERTIFIED') {
            req.error("You already attended the test")
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
        const { ID } = req.params[0];
        console.log("This is on hook");

        const enrlData = await SELECT.from(Enrollments);
        console.log(enrlData);
        const today_Date = new Date();
        console.log(`[${today_Date}] Daily report triggered by Job Scheduler`);


        const updateData = await UPDATE(Enrollments).set({ Status_status: 'COMPLETED', Criticality: 5 }).where({ ID: ID });

        return `Sheduled Job executed successfully ${today_Date}`






    })


    // ! Complete Before Hook


    this.before('complete', async (req) => {

        console.log("Before Hook");
        const { ID } = req.params[0];
        const { score } = req.data;

        const EnrollData = await SELECT.one.from(Enrollments).where({ ID: ID });
        if (EnrollData.Status_status == 'REVOKED') {
            req.error("Sorry , you already revoked this course so you unable to complete the course");
            return;
        }

        console.log(ID);

        const data = await SELECT.one.from(traineeAss).where({ Enrollment_ID: ID })
        if (data) {
            if (data.Result == 'PASS') {
                req.error("Sorry You already attended the test");
                return;
            }
            else if (data.Result == 'FAIL') {
                req.notify("This is 2nd Attempt");
                return await this.send({
                    event: 'Create_result',
                    data: { ID, score }
                })
            }
        }
        else if (!data) {
            await this.send({
                event: 'Create_result',
                data: { ID, score }
            })
        }
    })


    this.on('Create_result', async (req) => {
        const { score, ID } = req.data;
        console.log("This is create_result action");


        const data = await SELECT.one.from(traineeAss).where({ Enrollment_ID: ID });


        const enrlData = await SELECT.one.from(Enrollments).where({ ID: ID });

        console.log(enrlData);
        console.log(enrlData.Course_ID);


        const Get_AssDetail = await SELECT.one.from(assesment_det).where({ Course_ID: enrlData.Course_ID })
        console.log(Get_AssDetail);

        let res = "";
        if (score >= Get_AssDetail.PassMarks) {
            res = "PASS"
        }
        else {
            res = "FAIL"
        }


        const ass_data = await SELECT.one.from(traineeAss).where({ Enrollment_ID: ID })
        if (!ass_data) {
            const create_result = {
                ObtainedMarks: score,
                Result: res,
                Enrollment_ID: ID,
            }

            const create_Ass = await INSERT.into(traineeAss).entries(create_result);
            console.log(create_Ass);
            return;
        }
        else {

            const create_Ass = await UPDATE(traineeAss).set({ ObtainedMarks: score, Result: res }).where({ Enrollment_ID: ID });
            console.log(create_Ass);
        }


    })

    // ! Complete ON Hook


    this.on('complete', async (req) => {

        console.log("On Hook");
        const { ID } = req.params[0];
        const { score } = req.data;

        console.log(ID);


        const enrlData = await SELECT.one.from(Enrollments).where({ ID: ID });

        console.log(enrlData);

        const updateData = await UPDATE(Enrollments).set({ Score: score }).where({ ID: ID })
        console.log(updateData);




    })


    // ! Complete After Hook


    this.after('complete', async (data, req) => {

        console.log("Afer hook");

        const { ID } = req.params[0];
        const { score } = req.data;
        console.log(ID, score);


        const enrlData = await SELECT.one.from(Enrollments).where({ ID: ID });

        const courseData = await SELECT.one.from(course).where({ ID: enrlData.Course_ID });
        console.log(courseData);

        const employeeData = await SELECT.one.from(employee).where({ ID: enrlData.Employee_ID });

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
        const qrData = `Certificate No: ${certificateNo},  Course Name: ${courseData.Title}, Expiry Date: ${expiryDate} ,Score: ${score}, Employee Name :${employeeData.Name}`;

        const qrUrl =
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;



        const cert_API = await cds.connect.to('Certificate_Api');


        const enrollData = await SELECT.one
            .from(Enrollments)
            .where({ ID: ID });

        if (!enrollData) {
            return req.error(404, 'Enrollment not found');
        }

        const empData = await SELECT.one
            .from(employee)
            .where({ ID: enrollData.Employee_ID });

        if (!empData) {
            return req.error(404, 'Employee not found');
        }

        const payload = {
            groupId: "01kshspte1hmcpgaqcjv73w2x3",
            customAttributes: {
                "custom.marks": "60"
            },

            recipient: {
                name: empData.Name,
                email: 'rami@gmail.com',
            },

        };

        console.log("PAYLOAD:");
        console.log(JSON.stringify(payload, null, 2));

        const apiKey = process.env.CERTIFIER_API_KEY ||
            "cfp_ESxqmRjB70wXJYdufmGgXzj5xIYfMPVXTdFl";

        // Create & Issue Certificate
        const response = await cert_API.send({
            method: 'POST',
            path: '/v1/credentials/create-issue-send',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Certifier-Version': '2022-10-26',
                'Content-Type': 'application/json'
            },
            data: payload
        });

        console.log("CERTIFIER RESPONSE:");
        console.log(JSON.stringify(response, null, 2));

        // Get Certificate Details
        const certDetails = await cert_API.send({
            method: 'GET',
            path: `/v1/credentials/${response.id}`,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Certifier-Version': '2022-10-26'
            }
        });



        console.log("CERT DETAILS:");
        console.dir(certDetails, { depth: null });

        // Check whether Certifier returns any URL
        const certificateURL = `https://credsverse.com/credentials/${response.publicId}`;

        console.log("CERTIFICATE URL:", certificateURL);
        console.log("............");
        

        const ass_data = await SELECT.one.from(traineeAss).where({ Enrollment_ID: ID })
        if (ass_data) {


            /* const create_Ass = await INSERT.into(traineeAss).entries(create_result);
            console.log(create_Ass);
    */
            if (ass_data.Result == 'PASS') {

                const updatesData = await UPDATE(Enrollments).set({
                    Status_status: 'CERTIFIED', CertificateNo: certificateNo, ExpiryDate: expiryDate, Criticality: 3, QRCodeURL: qrUrl, CertificateID: response.id,
                    CertificateURL: certificateURL
                }).where({ ID: ID });
            }
            else {
                const updatesData = await UPDATE(Enrollments).set({ Status_status: 'FAILED', Criticality: 1 }).where({ ID: ID });

            }
        }

        console.log("End....");
        

        let token = await generateToken();
        await notify(token)
        //     const enrlData = await SELECT.one.from(enrollment).where({ ID: enrollmentID });

        //     const updateData = await UPDATE(enrollment).set({ Status_status: 'CERTIFIED' }).where({ ID: enrollmentID });


    })

    async function generateToken() {
        console.log("Hi ");
        console.log(process.env.client_id);
        console.log(process.env.client_secret);
        
        const res = await axios.post(
            "https://ba5b8f19trial.authentication.us10.hana.ondemand.com/oauth/token",
            "grant_type=client_credentials",
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                auth: {
                    username: process.env.client_id,
                    password: process.env.client_secret
                }
            });
            console.log("Token generated");
            
        return res.data.access_token;
    }


    async function notify(token) {
        console.log("url:", process.env.url);

        await axios.post(

            process.env.url,
            {
                eventType: "Certify",
                severity: "INFO",
                subject: "Course Completion Certificate",
                body: "Congratulations ! you have successfully completed the course and earned your certificate, Click the link to view your certificate",
                category: "NOTIFICATION",
                resource: {
                    resourceName: "Certificate Details",
                    resourceType: "Certificate",

                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                httpAgent: new https.Agent({ rejectUnauthorized: false }),
                proxy: false
            }


        )
    }


    // ! Revoke Before Hook
    this.before('revoke', async (req) => {
        const { ID } = req.params[0];
        const data = await SELECT.one.from(Enrollments).where({ ID: ID });
        if (data.Status_status == 'COMPLETED' || data.Status_status == 'CERTIFIED') {
            req.error("You already completed the course");
            return;
        }
    })

    //    !  Revoke ON Hook

    this.before('revoke', async (req) => {
        const { ID } = req.params[0];
        const data = await SELECT.one.from(Enrollments).where({ ID: ID });
        if (data.Status_status == 'REVOKED') {
            req.error("You already revoked this course");
            return;
        }
    })

    this.on('revoke', async (req) => {

        const { ID } = req.params[0];
        const { reason } = req.data;

        const updateData = await UPDATE(Enrollments).set({ Reason: reason, Status_status: 'REVOKED', Criticality: 1 }).where({ ID: ID })
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


        const result = await SELECT.from(Enrollments)
            .where`
            ExpiryDate >= ${todayStr}
            and ExpiryDate <= ${futureDateStr}
            and Status_status ='CERTIFIED'
        `;
        if (result.length == 0) {
            req.info("No certificates expiring within the specified period.");
        }
        else {
            console.log(result[0].CertificateNo);
            for (let i = 0; i < result.length; i++) {
                console.log(result[i].CertificateNo);
                req.notify(`Certificate ${result[i].CertificateNo} `);
            }



        }


    });



    /*   this.on('READ', Enrollments, async (req) => {
     
          return SELECT.from('training.db.Enrollments')
              .where(`Employee.Email = '${req.user.id}'`)
      }); */
    // 

    this.on('createCourse', async (req) => {

        const {
            CourseCode,
            Title,
            Description,
            Category,
            Duration_Hours,
            Duration_Days,
            IsMandatory,
            ValidityMonths,
            MaxEnrollments,
            Trainer_ID
        } = req.data;

        const newCourseData = {
            CourseCode,
            Title,
            Description,
            Duration_Hours,
            Duration_Days,
            IsMandatory,
            ValidityMonths,
            MaxEnrollments,
            Trainer_ID,
            Category_Category: Category
        };

        await INSERT.into(course).entries(newCourseData);

        req.notify("Course Created Successfully");

    });
    this.on('updateCourse', async (req) => {
        const { ID } = req.data;

        const data = await SELECT.one.from(course).where({ ID: ID });
        if (!data) {
            req.error(404, "Course Not Found");
            return;
        }



        const { CourseCode,
            Title,
            Description,
            Category,
            Duration_Hours,
            Duration_Days,
            IsMandatory,
            ValidityMonths,
            MaxEnrollments,
            Trainer_ID } = req.data;

        await UPDATE(course).set({ CourseCode, Title, Description, Category_Category: Category, Duration_Hours, Duration_Days, IsMandatory, ValidityMonths, MaxEnrollments, Trainer_ID }).where({ ID: ID });

        req.notify("Course Updated Successfully");

    })

    this.on('deleteCourse', async (req) => {
        const { ID } = req.data;

        await DELETE.from(course).where({ ID: ID });

        req.notify("Course Deleted Successfully");
    })
    this.on('getCourse', async (req) => {
        const courseData = await SELECT.from(course);
        for (let i = 0; i < courseData.length; i++) {
            req.info(courseData[i].Title);
        }
        req.info(courseData);
        return courseData;

    })



    this.after('READ', Enrollments, async (data, req) => {


        const { rate, totalCount, completedCount } = await getCompletionRate();

        console.log(rate, totalCount, completedCount);


        /*  const rows = Array.isArray(data) ? data : [data];
     
         for (const row of rows) {
           row.CompletionRate = rate;
         } */
        const rows = Array.isArray(data) ? data : [data];
        const today = new Date();

        rows.forEach(row => {
            row.CompletionRate = rate;
            row.TotalEnrollments = totalCount;
            row.CompletedEnrollments = completedCount;
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


    //!   Function for Get Certified Employees. 
    async function getCompletionRate() {

        const total = await SELECT.one
            .from('Enrollments')
            .columns('count(*) as CNT');

        const completed = await SELECT.one
            .from('Enrollments')
            .columns('count(*) as CNT')
            .where({ ExpiryDate: { '!=': null } });

        const totalCount = total.CNT || 0;
        const completedCount = completed.CNT || 0;

        const rate =
            totalCount > 0
                ? Number(((completedCount / totalCount) * 100).toFixed(2))
                : 0;


        console.log(rate);


        return {
            totalCount, rate,
            completedCount
        }
    }


    /*   this.on('QrCode', async (req) => {
     
          const cert_API = await cds.connect.to('Certificate_Api');
     
          const { enrollmentID } = req.data;
     
          console.log(enrollmentID);
     
     
          const enrlData = await SELECT.one
              .from(Enrollments)
              .where({ ID: enrollmentID });
     
          console.log(enrlData);
     
     
          const empData = await SELECT.one.from(employee).where({ ID: enrlData.Employee_ID });
     
          console.log(empData);
     
          const CourseData = await SELECT.one.from(course).where({ ID: enrlData.Course_ID });
     
          console.log(CourseData);
     
     
          if (!enrlData) {
              req.error(404, 'Enrollment not found');
          }
     
          const payload = {
              groupId: "01kshspte1hmcpgaqcjv73w2x3",
              recipient: {
                  name: empData.Name,
                  email: empData.Email
              },
              customAttributes: {
                  course: CourseData.Title,
                  completion_date: enrlData.CompletionDate,
                  QRCodeURL: enrlData.QRCodeURL
              }
          };
     
          console.log("PayLOad:", payload);
     
          let response;
     
          try {
              response = await cert_API.send({
                  method: 'POST',
                  path: '/v1/credentials/create-issue-send',
                  headers: {
                      Authorization: `Bearer ${process.env.CERTIFIER_API_KEY}`,
                      'Certifier-Version': '2022-10-26',
                      'Content-Type': 'application/json'
                  },
                  data: payload
              });
     
              console.log("CERTIFIER RESPONSE:");
              console.log(JSON.stringify(response, null, 2));
     
          } catch (err) {
              console.error("CERTIFIER ERROR:");
              console.error(err);
              console.error("Response Body:", err.response?.data);
              throw err;
          }
     
          return response;
     
          const certData = response.data;
     
          console.log(certData);
     
          await UPDATE(Enrollments)
              .set({
                  CertificateID: certData.id,
                  CertificateURL: certData.url   // adjust based on actual response
              })
              .where({ ID: enrollmentID });
     
          return certData;
      }) */
    // this.on('QrCode', async (req) => {

    //     const cert_API = await cds.connect.to('Certificate_Api');
    //     const { enrollmentID } = req.data;

    //     try {

    //         const enrlData = await SELECT.one
    //             .from(Enrollments)
    //             .where({ ID: enrollmentID });

    //         if (!enrlData) {
    //             return req.error(404, 'Enrollment not found');
    //         }

    //         const empData = await SELECT.one
    //             .from(employee)
    //             .where({ ID: enrlData.Employee_ID });

    //         if (!empData) {
    //             return req.error(404, 'Employee not found');
    //         }

    //         const payload = {
    //             groupId: "01kshspte1hmcpgaqcjv73w2x3",
    //             recipient: {
    //                 name: empData.Name,
    //                 email: empData.Email
    //             },
    //             customAttributes: {
    //                 marks: enrlData.Score,
    //                 expiry_date: enrlData.ExpiryDate,

    //             }
    //         };

    //         console.log("PAYLOAD:");
    //         console.log(JSON.stringify(payload, null, 2));

    //         const apiKey = process.env.CERTIFIER_API_KEY ||
    //             "cfp_ESxqmRjB70wXJYdufmGgXzj5xIYfMPVXTdFl";

    //         // Create & Issue Certificate
    //         const response = await cert_API.send({
    //             method: 'POST',
    //             path: '/v1/credentials/create-issue-send',
    //             headers: {
    //                 Authorization: `Bearer ${apiKey}`,
    //                 'Certifier-Version': '2022-10-26',
    //                 'Content-Type': 'application/json'
    //             },
    //             data: payload
    //         });

    //         console.log("CERTIFIER RESPONSE:");
    //         console.log(JSON.stringify(response, null, 2));

    //         // Get Certificate Details
    //         const certDetails = await cert_API.send({
    //             method: 'GET',
    //             path: `/v1/credentials/${response.id}`,
    //             headers: {
    //                 Authorization: `Bearer ${apiKey}`,
    //                 'Certifier-Version': '2022-10-26'
    //             }
    //         });



    //         console.log("CERT DETAILS:");
    //         console.dir(certDetails, { depth: null });

    //         // Check whether Certifier returns any URL
    //         const certificateURL = `https://credsverse.com/credentials/${response.publicId}`;

    //         console.log("CERTIFICATE URL:", certificateURL);

    //         // Save in DB
    //         await UPDATE(Enrollments)
    //             .set({
    //                 CertificateID: response.id,
    //                 CertificateURL: certificateURL
    //             })
    //             .where({ ID: enrollmentID });

    //         return {
    //             CertificateID: response.id,
    //             PublicID: response.publicId,
    //             CertificateURL: certificateURL,
    //             CertifierResponse: certDetails
    //         };

    //     } catch (err) {

    //         console.error("CERTIFIER ERROR:");

    //         console.error(
    //             JSON.stringify(
    //                 err.response?.data ||
    //                 err.reason?.response?.body ||
    //                 err.reason?.response ||
    //                 err,
    //                 null,
    //                 2
    //             )
    //         );

    //         req.error(
    //             500,
    //             err.response?.data?.error?.message ||
    //             err.message ||
    //             'Certifier API Error'
    //         );
    //     }
    // });




    this.on('getExpiredCertificates', async (req) => {

        const today = new Date().toISOString();
        const expiredCertificates = await SELECT
            .from(Enrollments)
            .where({
                ExpiryDate: { '<': today }
            });

        if (expiredCertificates.length == 0) {
            // Update status to Expired
            await UPDATE(Enrollments)
                .set({
                    Status_status: 'EXPIRED', Criticality: 1
                })
                .where({
                    ExpiryDate: { '<': today }
                });


            // Get expired certificates


            req.info("Expired certificates updated successfully");
        }
        else {
            req.info("No expired certificates found");
        }

    });
})
