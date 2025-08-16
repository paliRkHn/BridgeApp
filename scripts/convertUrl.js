// workaround to convert cloud storage URL to working URL (Cloud Storage to read public access)

const convertUrl = (consoleUrl) => {
    return consoleUrl.replace('.firebasestorage.app', '.appspot.com');
};

// replace current public URL from cloud storage console
const consoleUrl = "https://firebasestorage.googleapis.com/v0/b/bridge-app-02.firebasestorage.app/o/company-banners%2Frodeo-project-management-software-ONe-snuCaqQ-unsplash.jpg?alt=media&token=671839fb-f3cd-45ae-ab55-23c75f6fbd09";

const workingUrl = convertUrl(consoleUrl);
console.log(workingUrl);