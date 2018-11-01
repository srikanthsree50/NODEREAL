require('./../bin/dev');
function printEnvVariables(){
  console.log(process.env.DB_HOST);
}

printEnvVariables();
