// load in config
var config = require('./environment');


module.exports= {
    apiEvents:{
        GET_Log:{
            name:"GET_audit_v1_audit-log_demo",
            url:"/audit/v1/audit-log-demo",
            method:"GET",
            requireAuth: true,
            expectedStatus: 200
        }
    }
}

