# ✨ Weather App (TypeScript + React)

An enhanced weather application built with **React, TypeScript, and TailwindCSS**, providing real-time weather updates, forecasts, and a modern UI with improved performance and accessibility.

---

## 🚀 New Features & Enhancements

This project is a **TypeScript version** of my existing **JavaScript Weather App**, with **significant improvements**:

### ✅ **User Experience**
- Added **loading spinner** for a smoother UX while fetching data.
- Enhanced animations using **Framer Motion** for better interactivity.

### 🔥 **Performance Optimization**
- Implemented **lazy loading** for non-immediate components (e.g., modals) to improve load times.
- Optimized derived values (`roundedValues`, `timeOfDay`, `uvIndex`) using **useMemo** to prevent unnecessary recalculations.

### 🛠️ **Error Handling**
- Categorized **network errors, API limit errors, and unexpected errors** for better debugging and user feedback.

### 🌍 **Accessibility**
- Improved **keyboard navigation, focus states, and ARIA labels** for a more inclusive experience.

---

## ⚙️ Installation & Setup

1️⃣ **Clone the repository**
```bash
git clone https://github.com/meranHM/weather-app-ts.git
cd weather-app-ts
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Start the development server**
```bash
npm run dev
```

4️⃣ **Build for production**
```bash
npm run build
```

---

## 🔐 API Integration

This app fetches real-time weather data from **WeatherAPI**. To use it, get an API key from [weatherapi.com](https://www.weatherapi.com/) and add it to your `.env` file:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

---

## 🛠️ Technologies Used

- **React 19 + TypeScript**
- **Vite** (for fast bundling)
- **Tailwind CSS** (for styling)
- **Framer Motion** (for animations)

---

## 📀 To-Do / Future Enhancements
- [ ] Implement **dark mode** support 🌙  
- [ ] Add **geolocation-based weather detection** 📍  
- [ ] Improve **unit conversion** (°C ⇄ °F)  

---


## 🎯 Author

👤 **Mehran Shahani**  
🔗 [GitHub](https://github.com/meranHM)  
 

