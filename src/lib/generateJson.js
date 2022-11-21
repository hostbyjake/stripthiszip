
const generateJson = (emails, folders) => {
  let CaseList = []

  const sharePointSite = 'https://vivifycompany.sharepoint.com/sites/SandreamSpecialties-CompanyFiles'
  const intervalInMinutes = 3
  const sharedMailbox = 'samples@vivifycompany.com'
  const subscription = '7be458ed-9d5e-4b79-bedb-b61e8510e45b'
  const emailsToParse = emails
  const locationToSend = folders
  const getCases = () => {  
  for (let i = 1; i < emailsToParse.length; i++) {
      let forEachNumber = i 
      let caseNumber = forEachNumber -1
      let createFileNumber = forEachNumber
      let folderPath = locationToSend[i]
      let caseNum = `Case_${caseNumber}`
      let forEachNum = `For_Each_${forEachNumber}`
      let createNewFolderNum = `Create_new_folder_${createFileNumber}`
      let listFolderNum = `List_Folder_${createFileNumber}`
      let createFileNum = `Create_file_${createFileNumber}`
      let conditionNum = `Condition_${createFileNumber}`
      let senderToParse = emailsToParse[i]
      
      const caseSwitch = {
      [caseNum]: {
          actions: {
            [forEachNum]: {
              actions: {
                [conditionNum]: {
                  actions: {},
                  else: {
                    actions: {
                        [createNewFolderNum]: {
                        inputs: {
                          body: { path: `${folderPath}` },
                          host: {
                            connection: {
                              name: "@parameters('$connections')['sharepointonline']['connectionId']"
                            }
                          },
                          method: 'post',
                          path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/tables/@{encodeURIComponent(encodeURIComponent('7be458ed-9d5e-4b79-bedb-b61e8510e45b'))}/createnewfolder`
                        },
                        runAfter: {},
                        type: 'ApiConnection'
                      }
                    }
                  },
                  expression: {
                    and: [
                      {
                        equals: [
                          `@items('${forEachNum}')?['Name']`,
                          `${folderPath}`
                        ]
                      }
                    ]
                  },
                  runAfter: {},
                  type: 'If'
                },
                [createFileNum]: {
                  inputs: {
                    body: `@items('${forEachNum}')`,
                    host: {
                      connection: {
                        name: "@parameters('$connections')['sharepointonline']['connectionId']"
                      }
                    },
                    method: 'post',
                    path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/files`,
                    queries: {
                      folderPath: `/Reporting/${folderPath}`,
                      name: "@triggerBody()?['subject']",
                      queryParametersSingleEncoded: true
                    }
                  },
                  runAfter: {
                    [conditionNum]: [ 'Succeeded' ]
                  },
                  runtimeConfiguration: {
                    contentTransfer: { transferMode: 'Chunked' }
                  },
                  type: 'ApiConnection'
                }
              },
              foreach: `@body('${listFolderNum}')`,
              runAfter: { [listFolderNum]: [ 'Succeeded' ] },
              type: 'Foreach'
            },
            [listFolderNum]: {
              inputs: {
                host: {
                  connection: {
                    name: "@parameters('$connections')['sharepointonline']['connectionId']"
                  }
                },
                method: 'get',
                path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/folders/@{encodeURIComponent('%252fReporting')}`
              },
              metadata: { '%252fReporting': '/Reporting' },
              runAfter: {},
              type: 'ApiConnection'
            }
          },
          case: `${senderToParse}`
        },
  }
  CaseList.push(caseSwitch)
   
   }
  }
  getCases()
  

// console.log(getCases())
let lastCaseEmailToParse = emailsToParse[0]
let lastCaseFolder = locationToSend[0]
let lastCaseNumber = emailsToParse.length
let lastCaseIdentifier = lastCaseNumber -1
let lastCaseNum = `Case_${lastCaseNumber}`
let lastForEachNum = `For_Each_${lastCaseIdentifier}`
let lastCreateNewFolderNum = `Create_new_folder_${lastCaseIdentifier}`
let lastListFolderNum = `List_Folder_${lastCaseIdentifier}`
let lastCreateFileNum = `Create_file_${lastCaseIdentifier}`
let lastConditionNum = `Condition_${lastCaseNumber}`

const lastCase = {
      [lastCaseNum]: {
          actions: {
            [lastForEachNum]: {
              actions: {
                [lastConditionNum]: {
                  actions: {},
                  else: {
                    actions: {
                        [lastCreateNewFolderNum]: {
                        inputs: {
                          body: { path: `${lastCaseFolder}` },
                          host: {
                            connection: {
                              name: "@parameters('$connections')['sharepointonline']['connectionId']"
                            }
                          },
                          method: 'post',
                          path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/tables/@{encodeURIComponent(encodeURIComponent('7be458ed-9d5e-4b79-bedb-b61e8510e45b'))}/createnewfolder`
                        },
                        runAfter: {},
                        type: 'ApiConnection'
                      }
                    }
                  },
                  expression: {
                    and: [
                      {
                        equals: [
                          `@items(${lastForEachNum}')?['Name']`,
                          `${lastCaseFolder}`
                        ]
                      }
                    ]
                  },
                  runAfter: {},
                  type: 'If'
                },
                [lastCreateFileNum]: {
                  inputs: {
                    body: `@items('${lastForEachNum}')`,
                    host: {
                      connection: {
                        name: "@parameters('$connections')['sharepointonline']['connectionId']"
                      }
                    },
                    method: 'post',
                    path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/files`,
                    queries: {
                      folderPath: `/Reporting/${lastCaseFolder}`,
                      name: "@triggerBody()?['subject']",
                      queryParametersSingleEncoded: true
                    }
                  },
                  runAfter: {
                    [lastConditionNum]: [ 'Succeeded' ]
                  },
                  runtimeConfiguration: {
                    contentTransfer: { transferMode: 'Chunked' }
                  },
                  type: 'ApiConnection'
                }
              },
              foreach: `@body('${lastListFolderNum}')`,
              runAfter: { [lastListFolderNum]: [ 'Succeeded' ] },
              type: 'Foreach'
            },
            [lastListFolderNum]: {
              inputs: {
                host: {
                  connection: {
                    name: "@parameters('$connections')['sharepointonline']['connectionId']"
                  }
                },
                method: 'get',
                path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/folders/@{encodeURIComponent('%252fReporting')}`
              },
              metadata: { '%252fReporting': '/Reporting' },
              runAfter: {},
              type: 'ApiConnection'
            }
          },
          case: `${lastCaseEmailToParse}`
        }
}

// const assembleCases = () => {
// for (let i = 1; i < emailsToParse.length; i++) {
//     let forEachNumber = i 
//     let CaseList = []
//     let caseNumber = forEachNumber -1
//     let createFileNumber = forEachNumber
//     let folderPath = locationToSend[i]
//     let senderToParse = emailsToParse[i]
//     console.log(getCases(forEachNumber, senderToParse, folderPath))
// }
// }

// assembleCases()
const workFlow = {
  definition: {
    '$schema': 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
    actions: {
      'Delete_email_(V2)': {
        inputs: {
          host: {
            connection: {
              name: "@parameters('$connections')['office365']['connectionId']"
            }
          },
          method: 'delete',
          path: "/codeless/v1.0/me/messages/@{encodeURIComponent(triggerBody()?['id'])}"
        },
        runAfter: { Switch: [ 'Succeeded' ] },
        type: 'ApiConnection'
      },
      Switch: {
        cases: {
         CaseList,
          lastCase,
        },
        default: {
          actions: {
            For_each: {
              actions: {
                Create_file: {
                  inputs: {
                    body: "@items('For_each')",
                    host: {
                      connection: {
                        name: "@parameters('$connections')['sharepointonline']['connectionId']"
                      }
                    },
                    method: 'post',
                    path: `/datasets/@{encodeURIComponent(encodeURIComponent('${sharePointSite}'))}/files`,
                    queries: {
                      folderPath: '/Reporting',
                      name: "@triggerBody()?['subject']",
                      queryParametersSingleEncoded: true
                    }
                  },
                  runAfter: {},
                  runtimeConfiguration: {
                    contentTransfer: { transferMode: 'Chunked' }
                  },
                  type: 'ApiConnection'
                }
              },
              foreach: "@triggerBody()?['attachments']",
              runAfter: {},
              type: 'Foreach'
            }
          }
        },
        expression: "@triggerBody()?['from']",
        runAfter: {},
        type: 'Switch'
      }
    },
    contentVersion: '1.0.0.0',
    outputs: {},
    parameters: {
      '$connections': { defaultValue: {}, type: 'Object' }
    },
    triggers: {
      'When_a_new_email_arrives_in_a_shared_mailbox_(V2)': {
        evaluatedRecurrence: { frequency: 'Minute', interval: intervalInMinutes },
        inputs: {
          host: {
            connection: {
              name: "@parameters('$connections')['office365']['connectionId']"
            }
          },
          method: 'get',
          path: '/v2/SharedMailbox/Mail/OnNewEmail',
          queries: {
            folderId: 'Inbox',
            hasAttachments: true,
            importance: 'Any',
            includeAttachments: true,
            mailboxAddress: `${sharedMailbox}`
          }
        },
        recurrence: { frequency: 'Minute', interval: intervalInMinutes },
        splitOn: "@triggerBody()?['value']",
        type: 'ApiConnection'
      }
    }
  },
  parameters: {
    '$connections': {
      value: {
        office365: {
          connectionId: `/subscriptions/${subscription}/resourceGroups/LogicFlow/providers/Microsoft.Web/connections/office365`,
          connectionName: 'office365',
          id: `/subscriptions/${subscription}/providers/Microsoft.Web/locations/centralus/managedApis/office365`
        },
        sharepointonline: {
          connectionId: `/subscriptions/${subscription}/resourceGroups/LogicFlow/providers/Microsoft.Web/connections/sharepointonline`,
          connectionName: 'sharepointonline',
          id: `/subscriptions/${subscription}/providers/Microsoft.Web/locations/centralus/managedApis/sharepointonline`
        }
      }
    }
  }
}


return JSON.stringify(workFlow)
}

export default generateJson
