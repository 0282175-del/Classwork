const scheduleForm = document.getElementById("schedule-form");

const createCell = (content) => {
  const cell = document.createElement("td");
  cell.textContent = content;
  return cell;
};

const createStatusCell = (flag, busy) => {
  const cell = document.createElement("td");
  cell.style.textAlign = "center";

  const swatch = document.createElement("span");
  swatch.style.display = "inline-block";
  swatch.style.width = "14px";
  swatch.style.height = "14px";
  swatch.style.backgroundColor = flag;
  swatch.style.border = "1px solid #333";
  swatch.style.marginRight = "6px";

  const label = document.createElement("span");
  label.textContent = busy ? "Busy" : "Free";

  cell.appendChild(swatch);
  cell.appendChild(label);

  return cell;
};

const addScheduleEntry = (event) => {
  event.preventDefault();

  const date = scheduleForm.elements.date.value;
  const start = scheduleForm.elements.start.value;
  const end = scheduleForm.elements.end.value;
  const description = scheduleForm.elements.description.value.trim();
  const place = scheduleForm.elements.place.value.trim();
  const type = scheduleForm.elements.type.value;
  const notes = scheduleForm.elements.notes.value.trim();
  const busy = scheduleForm.elements.busy.checked;
  const flag = scheduleForm.elements.flag.value;

  if (!date || !start || !end || !description) {
    alert("Please complete date, start, end and description.");
    return;
  }

  if (end <= start) {
    alert("End time must be after start time.");
    return;
  }

  const tbody = document.querySelector("#schedule table tbody");
  const row = document.createElement("tr");

  [date, start, end, description, place, type, notes].forEach((value) => {
    row.appendChild(createCell(value));
  });

  row.appendChild(createStatusCell(flag, busy));

  tbody.appendChild(row);

  scheduleForm.reset();
  scheduleForm.elements.date.focus();
};

scheduleForm.addEventListener("submit", addScheduleEntry);
