const fs = require('fs');

const templates = [
  // Home Insurance
  { path: 'plans/home/homeowners.html', title: 'Homeowners Insurance', badge: 'Home Protection' },
  { path: 'plans/home/renters.html', title: 'Renters Insurance', badge: 'Tenant Coverage' },
  { path: 'plans/home/condo.html', title: 'Condo Insurance', badge: 'Condo Protection' },
  { path: 'plans/home/flood.html', title: 'Flood Insurance', badge: 'Flood Protection' },
  // Travel Insurance  
  { path: 'plans/travel/international.html', title: 'International Travel Insurance', badge: 'Global Coverage' },
  { path: 'plans/travel/domestic.html', title: 'Domestic Travel Insurance', badge: 'Domestic Coverage' },
  { path: 'plans/travel/medical.html', title: 'Travel Medical Insurance', badge: 'Medical Focus' },
  { path: 'plans/travel/cancellation.html', title: 'Trip Cancellation Insurance', badge: 'Cancellation Coverage' },
  // Business Insurance
  { path: 'plans/business/liability.html', title: 'General Liability Insurance', badge: 'Business Essential' },
  { path: 'plans/business/professional.html', title: 'Professional Liability Insurance', badge: 'E&O Coverage' },
  { path: 'plans/business/property.html', title: 'Business Property Insurance', badge: 'Property Protection' },
  { path: 'plans/business/workers-comp.html', title: 'Workers Compensation', badge: 'Employee Coverage' }
];

const createHTML = (title, badge) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SecureLife Insurance</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="stylesheet" href="../../css/plan-details.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <div class="logo">
                    <a href="../../index.html"><span>SecureLife</span></a>
                </div>
            </div>
        </div>
    </nav>
    <section class="plan-hero">
        <div class="container">
            <h1>${title}</h1>
            <div class="plan-badge">${badge}</div>
        </div>
    </section>
    <footer class="footer">
        <div class="container">
            <p>SecureLife Insurance</p>
        </div>
    </footer>
    <script src="../../js/main.js"></script>
</body>
</html>`;

templates.forEach(t => {
  fs.writeFileSync(t.path, createHTML(t.title, t.badge));
  console.log('Created:', t.path);
});
