var spawn = require("child_process").spawn,child;


child = spawn("powershell.exe",["c:\\Users\\jjones\\xDev\\stripthiszip\\backend\\switchcasejson.ps1"]);
child.stdout.on("data",function(data){
    console.log("Powershell Data: " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
    console.log("Powershell Script finished");
});
child.stdin.end(); //end input



// const { exec } = require('child_process');
// exec('Write-Output "HII" ', {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
//     // do whatever with stdout
//     console.log(stdout)
// })
