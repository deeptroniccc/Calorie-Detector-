const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const uploadBtn = document.getElementById('uploadBtn');
const preview = document.getElementById('preview');
const imagePreview = document.getElementById('imagePreview');
const progress = document.getElementById('progress');
const results = document.getElementById('results');

const IMGBB_API_KEY = 'ef29cba5619377601331829a41e4162d';
const GROQ_API_KEY = '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'; // Replace with your actual Groq key

uploadBtn.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  preview.classList.remove('hidden');
  imagePreview.src = URL.createObjectURL(file);
  progress.classList.remove('hidden');
  results.innerHTML = '';

  try {
    const formData = new FormData();
    formData.append('image', file);
    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadJson.success) throw new Error('ImgBB upload failed');
    const imageUrl = uploadJson.data.url;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Analyze the provided image and identify all distinct food items present. For each distinct food item, estimate the total quantity present in the image and calculate the total calories, total protein, total carbohydrates, and total fats for that quantity. Return the results in the following JSON format:\n' +
                  '{\n  "items": [\n    {\n      "item_name": "name of the food item",\n      "total_calories": total calories in kcal for all instances,\n      "total_protein": total protein in grams for all instances,\n      "total_carbs": total carbohydrates in grams for all instances,\n      "total_fats": total fats in grams for all instances\n    },\n    ...\n  ]\n}\n' +
                  'For example, if the image contains 5 eggs, provide the total nutritional values for 5 eggs combined, not for a single egg.',
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      }),
    });

    const groqData = await groqRes.json();
    progress.classList.add('hidden');

    if (!groqData.choices || !groqData.choices[0]?.message?.content) {
      console.error("❌ Groq returned no usable content:", groqData);
      results.innerHTML = `<p class="text-red-500">Error: No content received from Groq API</p>`;
      return;
    }

    const content = groqData.choices[0].message.content;
    const json = JSON.parse(content);

    json.items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'food-card bg-white rounded-lg shadow-md p-4';
      card.innerHTML = `
        <img src="${imageUrl}" alt="${item.item_name}" class="w-full h-48 object-cover rounded-lg mb-4">
        <h3 class="text-lg font-semibold">${item.item_name}</h3>
        <p class="text-gray-600">Calories: <span class="font-bold">${item.total_calories} kcal</span></p>
        <p class="text-gray-600">Protein: ${item.total_protein} g</p>
        <p class="text-gray-600">Carbs: ${item.total_carbs} g</p>
        <p class="text-gray-600">Fat: ${item.total_fats} g</p>
      `;
      results.appendChild(card);
    });

  } catch (error) {
    progress.classList.add('hidden');
    results.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    console.error("❌ Full error:", error);
  }
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    imageInput.files = e.dataTransfer.files;
    imageInput.dispatchEvent(new Event('change'));
  }
});
