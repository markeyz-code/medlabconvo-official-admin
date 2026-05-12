<template>
        <div >
                <NuxtPage />
                <!-- <AppFooter /> -->
                 <UpdatedFooter />
        </div>
</template>

<style>
/* Global styles can be added here */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
}

/* Define primary colors for the application */
:root {
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;
}

.text-primary-600 {
  color: var(--primary-600);
}
</style>