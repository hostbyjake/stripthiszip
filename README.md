This project generates a JSON file which can be inputted into the Azure Portal for a Logic App. 

The Logic App utilizes Azure's API connections to SharePoint and Outlook that can look through a Shared Mailbox, and filter through Emails with Attachements, and parse out those Attachements and put them into a SharePoint folder of your choice.

Let's say you have a SharedMailbox called billing@mycompanyname.com where all your invoices go into it. This Logic App can serve to filter these invoices,
an email from billing@comcast.com, can go into your Comcast Folder, an invoice from Microsoft can go into your Microsoft Folder and so forth. 
The goal is to automate away the sorting of these attachements for better management of these processes.


## Getting Started
Want to self host?
First, run the development server:

```bash
git clone https://github.com/hostbyjake/stripthiszip
cd stripthiszip
cd backend
npm install ##or yarn
node app.js
cd ..
npm install
npm run dev
# or
yarn
yarn dev
```

The backend is at http://localhost:5000
Front end is at http://localhost:3000

Backend requires the ability call a child process spawning Powershell as it is what will ultimately generate the JSON, 
This is possible on Linux - but untested and the commands in App.JS will need to be subsitituted to reflect for it.

Project was created in an environment that has the Windows OS and WSL Linux.

[HOW IT WORKS]

For each client, you can generate a table with a FROM (the email address to filter for) and a FOLDER (the SharePoint folder to which to save the attachements to) for a single Shared Mailbox.

Each Shared Mailbox will need to be it's own Logic App - but within the same Shared Mailbox, you can add unlimited amounts of options to parse for. This done by leveraging the Switch Case function available in logic apps, (and all coding languages!).

The Database utilized to store these records is via Firebase, to enable your own Firebase, provide the .env with the variables needed, there is an .env.example for the variable names.

Also - a JSON generated Firebase private key will be needed. You can produce this in the Firebase console. It was renamed 'firebasekey.json' in this project.

The front end is able to pull the data from the table, post it to an endpoint in the backend, and then it produces a JSON file in which a PowerShell Script can factor in for the variables that will generate the JSON. The JSON can then be downloaded directly by the end user of the application. With the JSON, you can go to into https://portal.azure.com, and create or use an existing resource group, generate a Logic App (consumption), and press 'Code View', then paste in the JSON to create your logic App.

If you'd prefer to deploy it from the CLI - assure Azure CLI is installed. If it is not, you may get it here https://aka.ms/installazurecliwindows 

or by running 
`
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
`
Once installed, authenticate with the Azure credentials. 

`
az login
`
Then create the Logic App
`
$rsgName = "enter name of the Resource Group"
$regionName ="enter Region Name"
$nameOfApp = "enter name of app"
az logic workflow create --resource-group $rsgName --location $regionName --name $nameOfApp --definition .\workflow.json
`
