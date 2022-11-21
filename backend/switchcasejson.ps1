#$sharePointSite = 'https://vivifycompany.sharepoint.com/sites/SandreamSpecialties-CompanyFiles'
$pathToExcel = 'C:\Users\jjones\Scripts\LogicAppVivify.xlsx'
$regionName = "centralus"
$resourceGroup = 'LogicFlow'
$nameOfFlow = 'MyFlow'

$csvTest = '.\newcsv.csv'
$workflowTest = '.\workflowSwitch.json'
$outputTest = '.\output.json'
#If ( (Test-Path $csvTest) ) { rm $csvTest  } else { Write-Host 'Directory is gone and no system traces detected!' };
#If ( (Test-Path $workflowTest) ) { rm $workflowTest  } else { Write-Host 'Directory is gone and no system traces detected!' };



function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

if (Check-Command -cmdname 'az') {
    Write-Host "Azure CLI is found..."
}
else {
    Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
    az extension add --name logic
    Write-Host "Please run 'az-login' and re-execute this script"
    return
}

# $output = az account show -o json | ConvertFrom-Json
# $subscriptionList = az account list -o json | ConvertFrom-Json 
# $subscriptionName = $output.name
# $subscriptionList | Format-Table name, id, tenantId, user -AutoSize
# $accountID = $output.id

$csvFile = Get-Content '.\output.json' | ConvertFrom-Json | ConvertTo-Csv
Write-Output $csvFile > .\newcsv.csv
$pathToCSV = '.\newcsv.csv'
$csv = Import-Csv -path $pathToCSV
$people = new-object System.Collections.ArrayList
$location = new-object System.Collections.ArrayList
foreach ($person in $csv.FROM) {
     $people.add($person) | out-null
}
foreach ($person in $csv.FOLDER) {
    $location.add($person) | out-null
}
$emailsToParse = $people -split ","
$locationToSend = $location -split ","
$sharedMailboxToParse = $csv.SHAREDMAILBOX
$subscription = $csv.SUBSCRIPTION
$sharePointSite = $csv.SHAREPOINT
$intervalInMinutesToRun = $csv.INTERVAL
#Install-module PSExcel -Force
#Import-module psexcel 
#$people = new-object System.Collections.ArrayList

#foreach ($person in (Import-XLSX -Path $pathToExcel -RowStart 1)) {
#    $people.add($person) | out-null 


$schema = "$" + "schema"
$connections = "$" + "connections"

#$emailsToParse = $people.FROM | Select-Object -unique
#$locationToSend = $people.FOLDER | Select-Object -unique

for ($i = 1; $i -lt $emailsToParse.Count; $i++) {
    $forEachNumber = $i 
    $forEachNumberActions = $i + 20
    $caseNumber = $forEachNumber -1
    $createFileNumber = $forEachNumber
    $folderPath = $locationToSend[$i]
    $senderToParse = $emailsToParse[$i]
    $EchoedStatement = 'If from ' + $senderToParse + ' going to ' + $folderPath
    Write-Output $EchoedStatement
    $Case = @"
    "Case_$caseNumber": {
        "actions": {
            "For_each_$forEachNumber": {
                "actions": {
                    "Condition_$caseNumber": {
                        "actions": {},
                        "else": {
                            "actions": {
                                "Create_new_folder_$createFileNumber": {
                                    "inputs": {
                                        "body": {
                                            "path": "$folderPath"
                                        },
                                        "host": {
                                            "connection": {
                                                "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                                            }
                                        },
                                        "method": "post",
                                        "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/tables/@{encodeURIComponent(encodeURIComponent('Reporting'))}/createnewfolder"
                                    },
                                    "runAfter": {},
                                    "type": "ApiConnection"
                                }
                            }
                        },
                        "expression": {
                            "and": [
                                {
                                    "equals": [
                                        "@items('For_each_$forEachNumber')?['Name']",
                                        "$folderPath"
                                    ]
                                }
                            ]
                        },
                        "runAfter": {},
                        "type": "If"
                    },
                    "For_each_$forEachNumberActions": {
                        "actions": {
                    "Create_file_$createFileNumber": {
                        "inputs": {
                            "body": "@base64ToBinary(items('For_each_$forEachNumberActions')?['contentBytes'])",
                            "host": {
                                "connection": {
                                    "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                                }
                            },
                            "method": "post",
                            "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/files",
                            "queries": {
                                "folderPath": "/Reporting/$FolderPath",
                                "name": "@items('For_each_$forEachNumberActions')?['name']",
                                "queryParametersSingleEncoded": true
                            }
                        },
                        "runAfter": {},
                        "runtimeConfiguration": {
                            "contentTransfer": {
                                "transferMode": "Chunked"
                            }
                        },
                        "type": "ApiConnection"
                    }
                },
                "foreach": "@triggerBody()?['attachments']",
                "runAfter": {
                    "Condition_$caseNumber": [
                        "Succeeded"
                    ]
                },
                "type": "Foreach"
            }
        },     
                "foreach": "@body('List_folder_$createFileNumber')",
                "runAfter": {
                    "List_folder_$createFileNumber": [
                        "Succeeded"
                    ]
                },
                "type": "Foreach"
            },
            "List_folder_$createFileNumber": {
                "inputs": {
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                        }
                    },
                    "method": "get",
                    "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/folders/@{encodeURIComponent('%252fReporting')}"
                },
                "metadata": {
                    "%252fReporting": "/Reporting"
                },
                "runAfter": {},
                "type": "ApiConnection"
            }
        },
        "case": "$senderToParse"
    },
"@
$CaseList += ($Case)
Write-Output $Case
}
$lastCaseEmailToParse = $emailsToParse[0]
$lastCaseFolder = $locationToSend[0]
$lastCaseNumber = $emailsToParse.Count
$lastCaseIdentifier = $LastCaseNumber -1
$forEachNumber = $lastCaseNumber + 1

$lastCase = @"
"Case_$lastCaseIdentifier": {
    "actions": {
        "For_each_$lastCaseNumber": {
            "actions": {
                "Condition_$lastCaseIdentifier": {
                    "actions": {},
                    "else": {
                        "actions": {
                            "Create_new_folder_$lastCaseNumber": {
                                "inputs": {
                                    "body": {
                                        "path": "$lastCaseFolder"
                                    },
                                    "host": {
                                        "connection": {
                                            "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                                        }
                                    },
                                    "method": "post",
                                    "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/tables/@{encodeURIComponent(encodeURIComponent('Reporting'))}/createnewfolder"
                                },
                                "runAfter": {},
                                "type": "ApiConnection"
                            }
                        }
                    },
                    "expression": {
                        "and": [
                            {
                                "equals": [
                                    "@items('For_each_$lastCaseNumber')?['Name']",
                                    "$lastCaseFolder"
                                ]
                            }
                        ]
                    },
                    "runAfter": {},
                    "type": "If"
                },
                "For_each_$forEachNumber": {
                "actions": {
                "Create_file_$lastCaseNumber": {
                    "inputs": {
                        "body": "@base64ToBinary(items('For_each_$forEachNumber')?['contentBytes'])",
                        "host": {
                            "connection": {
                                "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                            }
                        },
                        "method": "post",
                        "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/files",
                        "queries": {
                            "folderPath": "/Reporting/$lastCaseFolder",
                            "name": "@items('For_each_$forEachNumber')?['name']",
                            "queryParametersSingleEncoded": true
                        }
                    },
                    "runAfter": {},
                    "runtimeConfiguration": {
                        "contentTransfer": {
                            "transferMode": "Chunked"
                        }
                    },
                    "type": "ApiConnection"
                }
            },
            "foreach": "@triggerBody()?['attachments']",
            "runAfter": {
                "Condition_$lastCaseIdentifier": [
                    "Succeeded"
                ]
            },
            "type": "Foreach"
        }
    },
            "foreach": "@body('List_folder_$lastCaseNumber')",
            "runAfter": {
                "List_folder_$lastCaseNumber": [
                    "Succeeded"
                ]
            },
            "type": "Foreach"
        },
        "List_folder_$lastCaseNumber": {
            "inputs": {
                "host": {
                    "connection": {
                        "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                    }
                },
                "method": "get",
                "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/folders/@{encodeURIComponent('%252fReporting')}"
            },
            "metadata": {
                "%252fReporting": "/Reporting"
            },
            "runAfter": {},
            "type": "ApiConnection"
        }
    },
    "case": "$lastCaseEmailToParse"
}
"@


$workflowJson = @"
{
    "definition": {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
        "actions": {
            "Delete_email_(V2)": {
                "inputs": {
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['office365']['connectionId']"
                        }
                    },
                    "method": "delete",
                    "path": "/codeless/v1.0/me/messages/@{encodeURIComponent(triggerBody()?['id'])}",
                    "queries": {
                        "mailboxAddress": "$sharedMailboxToParse"
                    }
                },
                "runAfter": {
                    "Switch": [
                        "Succeeded"
                    ]
                },
                "type": "ApiConnection"
            },
            "Switch": {
                "cases": {
                    $CaseList
                    $lastCase
                },
                "default": {
                    "actions": {
                        "For_each": {
                            "actions": {
                                "Create_file": {
                                    "inputs": {
                                        "body": "@base64ToBinary(items('For_each')?['contentBytes'])",
                                        "host": {
                                            "connection": {
                                                "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                                            }
                                        },
                                        "method": "post",
                                        "path": "/datasets/@{encodeURIComponent(encodeURIComponent('$sharePointSite'))}/files",
                                        "queries": {
                                            "folderPath": "/Reporting",
                                            "name": "@triggerBody()?['name']",
                                            "queryParametersSingleEncoded": true
                                        }
                                    },
                                    "runAfter": {},
                                    "runtimeConfiguration": {
                                        "contentTransfer": {
                                            "transferMode": "Chunked"
                                        }
                                    },
                                    "type": "ApiConnection"
                                }
                            },
                            "foreach": "@triggerBody()?['attachments']",
                            "runAfter": {},
                            "type": "Foreach"
                        }
                    }
                },
                "expression": "@triggerBody()?['from']",
                "runAfter": {},
                "type": "Switch"
            }
        },
        "contentVersion": "1.0.0.0",
        "outputs": {},
        "parameters": {
            "$connections": {
                "defaultValue": {},
                "type": "Object"
            }
        },
        "triggers": {
            "When_a_new_email_arrives_in_a_shared_mailbox_(V2)": {
                "evaluatedRecurrence": {
                    "frequency": "Minute",
                    "interval": $intervalInMinutesToRun
                },
                "inputs": {
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['office365']['connectionId']"
                        }
                    },
                    "method": "get",
                    "path": "/v2/SharedMailbox/Mail/OnNewEmail",
                    "queries": {
                        "folderId": "Inbox",
                        "hasAttachments": true,
                        "importance": "Any",
                        "includeAttachments": true,
                        "mailboxAddress": "$sharedMailboxToParse"
                    }
                },
                "recurrence": {
                    "frequency": "Minute",
                    "interval": $intervalInMinutesToRun
                },
                "splitOn": "@triggerBody()?['value']",
                "type": "ApiConnection"
            }
        }
    },
    "parameters": {
        "$connections": {
            "value": {
                "office365": {
                    "connectionId": "/subscriptions/$subscription/resourceGroups/LogicFlow/providers/Microsoft.Web/connections/office365",
                    "connectionName": "office365",
                    "id": "/subscriptions/$subscription/providers/Microsoft.Web/locations/centralus/managedApis/office365"
                },
                "sharepointonline": {
                    "connectionId": "/subscriptions/$subscription/resourceGroups/LogicFlow/providers/Microsoft.Web/connections/sharepointonline",
                    "connectionName": "sharepointonline",
                    "id": "/subscriptions/$subscription/providers/Microsoft.Web/locations/centralus/managedApis/sharepointonline"
                }
            }
        }
    }
}
"@

Write-Output $workflowJson > .\workflowSwitch.json
#If ( (Test-Path $outputTest) ) { rm $outputTest  } else { Write-Host 'Directory is gone and no system traces detected!' };

## az logic workflow create --resource-group $resourceGroup --location $regionName --name $nameOfFlow --definition .\workflowSwitch.json