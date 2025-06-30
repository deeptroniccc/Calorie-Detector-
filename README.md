# 🍔 Calorie Detector

A smart AI-powered web app that detects food items from an uploaded image and estimates their **calories**, **protein**, **carbs**, and **fats** — all in one click!

---

## 🚀 Live Demo

🔗 [Visit the App](https://your-render-url.onrender.com)  
> calorie-detector-omega.vercel.app/

---

## 📸 Features

✅ Upload or capture food images  
✅ AI analyzes the image and returns detailed nutrition info  
✅ Interactive UI with TailwindCSS  
✅ Supports drag & drop and camera input  
✅ Smooth hover effects & loading spinner

---

## 📂 Tech Stack

- 🧱 **HTML5**
- 🎨 **Tailwind CSS**
- 🧠 **Vanilla JavaScript**
- ☁️ **ImgBB API** (for image upload)
- 🤖 **Groq LLaMA 4 API** (for food recognition + calorie estimation)

---

## ⚙️ How It Works

1. User uploads or drops a food image.
2. Image is uploaded to ImgBB and a public URL is generated.
3. This URL is sent to Groq's API with a prompt to extract food + nutrition info.
4. Groq returns a structured JSON with all the nutrition details.
5. The app displays all results as interactive cards.



