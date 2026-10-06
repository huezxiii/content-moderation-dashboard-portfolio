/**
 * ApexTrust Operations - Programmatic Power BI (.pbip / TMDL) Generator
 * Programmatically generates Microsoft Power BI Project packages (.pbip) in-browser
 * or via Node.js using JSZip. Exports semantic models conforming to TMDL specifications
 * with sound duration-weighted DAX measures and clean star-schema date hierarchies.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PowerBIExport = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const PowerBIExport = {};

  const PROJECT_NAME = 'ApexTrust_Moderation';

  /**
   * Generates TMDL definition for the Moderation fact table including measures.
   */
  PowerBIExport.generateModerationTableTmdl = function (records) {
    return `table Moderation
\tlineageTag: m0000001-0000-0000-0000-000000000001

\tmeasure 'Total Reviews' = COUNTROWS('Moderation')
\t\tformatString: #,##0
\t\tlineageTag: m0000002-0000-0000-0000-000000000002

\tmeasure 'Total Workload Hours' = DIVIDE(SUM('Moderation'[AHT_Seconds]), 3600, 0)
\t\tformatString: #,##0.0
\t\tlineageTag: m0000003-0000-0000-0000-000000000003

\tmeasure 'Weighted AHT' = DIVIDE(SUM('Moderation'[AHT_Seconds]), COUNTROWS('Moderation'), 0)
\t\tformatString: #,##0.0 "s"
\t\tlineageTag: m0000004-0000-0000-0000-000000000004

\tmeasure 'SLA Attainment %' = 
\t\tDIVIDE(
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[SLA_Breached] = 0),
\t\t\tCOUNTROWS('Moderation'),
\t\t\t0
\t\t) * 100
\t\tformatString: 0.0"%"
\t\tlineageTag: m0000005-0000-0000-0000-000000000005

\tmeasure 'QA Accuracy Rate' = 
\t\tCALCULATE(
\t\t\tAVERAGE('Moderation'[QA_Score]),
\t\t\t'Moderation'[QA_Audited] = 1
\t\t)
\t\tformatString: 0.0"%"
\t\tlineageTag: m0000006-0000-0000-0000-000000000006

\tmeasure 'False Positive Rate' = 
\t\tDIVIDE(
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[Error_Type] = "False_Positive"),
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[QA_Audited] = 1),
\t\t\t0
\t\t) * 100
\t\tformatString: 0.0"%"
\t\tlineageTag: m0000007-0000-0000-0000-000000000007

\tmeasure 'False Negative Rate' = 
\t\tDIVIDE(
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[Error_Type] = "False_Negative"),
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[QA_Audited] = 1),
\t\t\t0
\t\t) * 100
\t\tformatString: 0.0"%"
\t\tlineageTag: m0000008-0000-0000-0000-000000000008

\tmeasure 'Overturn Rate' = 
\t\tDIVIDE(
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[Overturned_Flag] = 1),
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[Appealed_Flag] = 1),
\t\t\t0
\t\t) * 100
\t\tformatString: 0.0"%"
\t\tlineageTag: m0000009-0000-0000-0000-000000000009

\tmeasure 'Action Rate %' = 
\t\tDIVIDE(
\t\t\tCALCULATE(COUNTROWS('Moderation'), 'Moderation'[Decision_Action] <> "Approve_Keep"),
\t\t\tCOUNTROWS('Moderation'),
\t\t\t0
\t\t) * 100
\t\tformatString: 0.0"%"
\t\tlineageTag: m000000a-0000-0000-0000-00000000000a

\tcolumn Review_ID
\t\tdataType: string
\t\tsourceColumn: Review_ID
\t\tlineageTag: c0000001-0000-0000-0000-000000000001

\tcolumn Timestamp
\t\tdataType: dateTime
\t\tformatString: yyyy-mm-dd hh:nn:ss
\t\tsourceColumn: Timestamp
\t\tlineageTag: c0000002-0000-0000-0000-000000000002

\tcolumn Agent_ID
\t\tdataType: string
\t\tsourceColumn: Agent_ID
\t\tlineageTag: c0000003-0000-0000-0000-000000000003

\tcolumn Tenure_Group
\t\tdataType: string
\t\tsourceColumn: Tenure_Group
\t\tlineageTag: c0000004-0000-0000-0000-000000000004

\tcolumn Queue_Name
\t\tdataType: string
\t\tsourceColumn: Queue_Name
\t\tlineageTag: c0000005-0000-0000-0000-000000000005

\tcolumn Content_Type
\t\tdataType: string
\t\tsourceColumn: Content_Type
\t\tlineageTag: c0000006-0000-0000-0000-000000000006

\tcolumn Egregious_Flag
\t\tdataType: int64
\t\tformatString: 0
\t\tsourceColumn: Egregious_Flag
\t\tlineageTag: c0000007-0000-0000-0000-000000000007

\tcolumn HITL_Routing
\t\tdataType: string
\t\tsourceColumn: HITL_Routing
\t\tlineageTag: c0000008-0000-0000-0000-000000000008

\tcolumn AHT_Seconds
\t\tdataType: double
\t\tformatString: #,##0.0
\t\tsourceColumn: AHT_Seconds
\t\tlineageTag: c0000009-0000-0000-0000-000000000009

\tcolumn TAT_Minutes
\t\tdataType: double
\t\tformatString: #,##0.0
\t\tsourceColumn: TAT_Minutes
\t\tlineageTag: c000000a-0000-0000-0000-00000000000a

\tcolumn SLA_Breached
\t\tdataType: int64
\t\tformatString: 0
\t\tsourceColumn: SLA_Breached
\t\tlineageTag: c000000b-0000-0000-0000-00000000000b

\tcolumn Decision_Action
\t\tdataType: string
\t\tsourceColumn: Decision_Action
\t\tlineageTag: c000000c-0000-0000-0000-00000000000c

\tcolumn QA_Audited
\t\tdataType: int64
\t\tformatString: 0
\t\tsourceColumn: QA_Audited
\t\tlineageTag: c000000d-0000-0000-0000-00000000000d

\tcolumn QA_Score
\t\tdataType: double
\t\tformatString: 0.0
\t\tsourceColumn: QA_Score
\t\tlineageTag: c000000e-0000-0000-0000-00000000000e

\tcolumn Error_Type
\t\tdataType: string
\t\tsourceColumn: Error_Type
\t\tlineageTag: c000000f-0000-0000-0000-00000000000f

\tcolumn Appealed_Flag
\t\tdataType: int64
\t\tformatString: 0
\t\tsourceColumn: Appealed_Flag
\t\tlineageTag: c0000010-0000-0000-0000-000000000010

\tcolumn Overturned_Flag
\t\tdataType: int64
\t\tformatString: 0
\t\tsourceColumn: Overturned_Flag
\t\tlineageTag: c0000011-0000-0000-0000-000000000011

\tcolumn Content_Snippet
\t\tdataType: string
\t\tsourceColumn: Content_Snippet
\t\tlineageTag: c0000012-0000-0000-0000-000000000012

\tpartition Moderation = m
\t\tmode: import
\t\tsource = 
\t\t\tlet
\t\t\t\tSource = Csv.Document(File.Contents("dashboard-ready.csv"),[Delimiter=",", Columns=18, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
\t\t\t\t#"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
\t\t\t\t#"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"Review_ID", type text}, {"Timestamp", type datetime}, {"Agent_ID", type text}, {"Tenure_Group", type text}, {"Queue_Name", type text}, {"Content_Type", type text}, {"Egregious_Flag", Int64.Type}, {"HITL_Routing", type text}, {"AHT_Seconds", type number}, {"TAT_Minutes", type number}, {"SLA_Breached", Int64.Type}, {"Decision_Action", type text}, {"QA_Audited", Int64.Type}, {"QA_Score", type number}, {"Error_Type", type text}, {"Appealed_Flag", Int64.Type}, {"Overturned_Flag", Int64.Type}, {"Content_Snippet", type text}})
\t\t\tin
\t\t\t\t#"Changed Type"
`;
  };

  /**
   * Generates TMDL definition for Date dimension table.
   */
  PowerBIExport.generateDateTableTmdl = function () {
    return `table DateTable
\tlineageTag: d0000001-0000-0000-0000-000000000001

\tcolumn Date
\t\tdataType: dateTime
\t\tisKey
\t\tformatString: yyyy-mm-dd
\t\tlineageTag: d0000002-0000-0000-0000-000000000002
\t\tsourceColumn: [Date]

\tcolumn Year
\t\tdataType: int64
\t\tformatString: 0
\t\tlineageTag: d0000003-0000-0000-0000-000000000003
\t\tsourceColumn: [Year]

\tcolumn Month
\t\tdataType: string
\t\tlineageTag: d0000004-0000-0000-0000-000000000004
\t\tsourceColumn: [Month]

\tcolumn MonthNumber
\t\tdataType: int64
\t\tformatString: 0
\t\tlineageTag: d0000005-0000-0000-0000-000000000005
\t\tsourceColumn: [MonthNumber]

\tpartition DateTable = calculated
\t\tmode: import
\t\tsource = 
\t\t\tADDCOLUMNS(
\t\t\t\tCALENDAR(DATE(2026, 9, 1), DATE(2026, 10, 31)),
\t\t\t\t"Year", YEAR([Date]),
\t\t\t\t"Month", FORMAT([Date], "mmm yyyy"),
\t\t\t\t"MonthNumber", MONTH([Date])
\t\t\t)
`;
  };

  /**
   * Builds the complete in-memory ZIP package representing the .pbip project.
   */
  PowerBIExport.generatePbipZip = function (records, zipInstance) {
    let zip;
    if (zipInstance && typeof zipInstance.file === 'function') {
      zip = zipInstance;
    } else if (typeof zipInstance === 'function') {
      zip = new zipInstance();
    } else if (typeof JSZip !== 'undefined') {
      zip = new JSZip();
    } else {
      return Promise.reject(new Error('JSZip is not available'));
    }

    // 1. Root .pbip file
    const pbipConfig = {
      version: '1.0',
      artifacts: [
        {
          report: {
            path: `${PROJECT_NAME}.Report`
          }
        }
      ],
      settings: {
        enableAutoRecovery: true
      }
    };
    zip.file(`${PROJECT_NAME}.pbip`, JSON.stringify(pbipConfig, null, 2));

    // 2. SemanticModel
    const smFolder = `${PROJECT_NAME}.SemanticModel`;
    zip.file(`${smFolder}/definition.pbism`, JSON.stringify({ version: '4.2', settings: {} }, null, 2));

    const smDef = `${smFolder}/definition`;
    zip.file(`${smDef}/model.tmdl`, `model Model
\tculture: en-US
\tdefaultPowerBIDataSourceVersion: powerBI_V3
\tsourceQueryCulture: en-US
\tdataAccessOptions
\t\tlegacyRedirects
\t\treturnErrorValuesAsNull

annotation PBI_QueryOrder = ["Moderation"]
annotation __PBI_TimeIntelligenceEnabled = 1

ref table Moderation
ref table DateTable
ref cultureInfo en-US
`);

    zip.file(`${smDef}/cultures/en-US.tmdl`, `cultureInfo en-US\n`);
    zip.file(`${smDef}/relationships.tmdl`, `relationship AutoDetected_1\n\tfromColumn: Moderation.Timestamp\n\ttoColumn: DateTable.Date\n`);
    zip.file(`${smDef}/tables/Moderation.tmdl`, PowerBIExport.generateModerationTableTmdl(records));
    zip.file(`${smDef}/tables/DateTable.tmdl`, PowerBIExport.generateDateTableTmdl());

    // 3. Report
    const repFolder = `${PROJECT_NAME}.Report`;
    const pbirConfig = {
      version: '4.0',
      datasetReference: {
        byPath: {
          path: `../${PROJECT_NAME}.SemanticModel`
        },
        byConnection: null
      }
    };
    zip.file(`${repFolder}/definition.pbir`, JSON.stringify(pbirConfig, null, 2));

    const reportJson = {
      config: JSON.stringify({
        version: '5.50',
        themeCollection: {
          baseTheme: {
            name: 'CY24SU08',
            version: '5.50',
            type: 2
          }
        }
      }),
      layoutOptimization: 0,
      resourcePackages: []
    };
    zip.file(`${repFolder}/report.json`, JSON.stringify(reportJson, null, 2));

    // 4. Instructions README
    const readmeContent = `# ${PROJECT_NAME} - Microsoft Power BI Project (.pbip)

This directory package contains a programmatic Microsoft Power BI Project (.pbip) generated from the ApexTrust Operations Content Moderation Analytics Platform.

## Opening Instructions:
1. Ensure you have **Microsoft Power BI Desktop** (August 2024 or newer).
2. Verify that **Power BI Project (.pbip) save option** and **Store semantic model using TMDL format** are enabled under:
   \`File > Options and settings > Options > Preview features\`.
3. Double click \`${PROJECT_NAME}.pbip\` to open the project.
4. Ensure \`dashboard-ready.csv\` is placed in the same working directory when prompted for data source refresh.
`;
    zip.file('README.md', readmeContent);

    return Promise.resolve(zip);
  };

  /**
   * Browser-specific download handler
   */
  PowerBIExport.downloadPbipZip = function (records) {
    if (typeof JSZip === 'undefined') {
      alert('JSZip library is required to export Power BI project.');
      return;
    }

    const zip = new JSZip();
    PowerBIExport.generatePbipZip(records, zip).then(readyZip => {
      readyZip.generateAsync({ type: 'blob' }).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${PROJECT_NAME}.pbip.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  };

  return PowerBIExport;
}));
