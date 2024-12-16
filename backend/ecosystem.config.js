module.exports={
    apps:[
        {
            name:"sisgl",
            script:"npm",
            args:"run dev",
            env:{
                NODE_ENV:"develoment",
                ENV_VAR1:"enviroment-variable"
            }
        }
    ]
}