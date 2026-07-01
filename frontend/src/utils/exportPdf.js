export const exportApplicationsToPdf = (applications) => {
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <html>
      <head>
        <title>Career Compass AI - Placement Application History</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            padding: 30px;
            color: #333;
          }
          .header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
          }
          .date {
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            font-size: 13px;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
            color: #111;
          }
          .stage {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
          }
          .stage-interested { background: #e0f2fe; color: #0369a1; }
          .stage-applied { background: #f3e8ff; color: #6b21a8; }
          .stage-oa { background: #fef3c7; color: #92400e; }
          .stage-tech { background: #dcfce7; color: #166534; }
          .stage-hr { background: #e0e7ff; color: #3730a3; }
          .stage-offered { background: #d1fae5; color: #065f46; }
          .stage-rejected { background: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Career Compass AI</div>
            <div style="font-size: 14px; color: #555; margin-top: 4px;">Candidate Placement Application Report</div>
          </div>
          <div class="date">Exported on: ${new Date().toLocaleDateString()}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Role / Position</th>
              <th>Package (LPA)</th>
              <th>Location</th>
              <th>Application Date</th>
              <th>Current Stage</th>
            </tr>
          </thead>
          <tbody>
            ${applications.map((app, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${app.companyName}</strong></td>
                <td>${app.role}</td>
                <td>${app.packageOffered ? app.packageOffered + ' LPA' : 'N/A'}</td>
                <td>${app.location || 'N/A'}</td>
                <td>${new Date(app.applicationDate).toLocaleDateString()}</td>
                <td>
                  <span class="stage stage-${app.currentStage.toLowerCase().replace(' ', '-')}">
                    ${app.currentStage}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for resources to load, then trigger standard system print
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
