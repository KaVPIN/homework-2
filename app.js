const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const checkedMap = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };

  const items = services
    .filter((service) => checkedMap[service.id])
    .map((service) => {
      const { title, price } = service;
      return { title: title.trim(), price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { count: items.length, total, items };
}

const form = document.querySelector('#service-form');
const dataError = document.querySelector('#data-error');

let data = null;
try {
  data = JSON.parse(sourceJson);
} catch (err) {
  dataError.hidden = false;
}

if (data) {
  form.hidden = false;

  const choiceError = document.querySelector('#choice-error');
  const program = document.querySelector('#program');
  const result = document.querySelector('#result');
  const reportJson = document.querySelector('#report-json');
  const showProgramBtn = document.querySelector('#show-program');

  showProgramBtn.addEventListener('click', () => {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const guideChecked = document.querySelector('#guide').checked;
    const audioChecked = document.querySelector('#audio').checked;
    const catalogChecked = document.querySelector('#catalog').checked;

    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

    if (report.count === 0) {
      choiceError.hidden = false;
      result.hidden = true;
      reportJson.hidden = true;
      return;
    }

    choiceError.hidden = true;
    result.hidden = false;
    reportJson.hidden = false;

    const titlesHtml = report.items.map((item) => item.title).join('<br>');
    result.innerHTML =
      `Выбрано услуг: ${report.count}<br>` +
      `Итого: ${report.total} руб.<br>` +
      titlesHtml;

    const jsonStr = JSON.stringify(report);
    JSON.parse(jsonStr);
    reportJson.textContent = jsonStr;
  });
}