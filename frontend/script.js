// Espera o conteúdo HTML da página ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- ESTADO DA APLICAÇÃO ---
    // Um objeto JavaScript simples para guardar todas as informações dinâmicas.
    const state = {
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        selectedDate: null,
        selectedTime: null,
        professional: {
            name: "Dr. João Silva",
            specialty: "Clínico Geral",
            availability: {
                weekdays: [1, 2, 3, 4, 5], // 0=Dom, 1=Seg, ... 6=Sáb
                startTime: "09:00",
                endTime: "17:00",
                slotInterval: 60, // em minutos
            },
            // Simulação de dados que viriam do backend
            busySlots: {
                // Formato "AAAA-MM-DD"
                "2025-06-16": ["10:00", "14:00"],
                "2025-06-18": ["11:00"],
            }
        }
    };

    // --- SELEÇÃO DE ELEMENTOS HTML (DOM) ---
    // Guardamos referências aos elementos HTML para manipulá-los depois.
    const app = document.getElementById('booking-app');
    const professionalHeader = {
        name: app.querySelector('#professional-header h1'),
        specialty: app.querySelector('#professional-header p')
    };
    const calendarContainer = app.querySelector('#calendar-container');
    const slotsColumn = app.querySelector('#slots-column');
    const timeSlotsContainer = app.querySelector('#time-slots-container');
    const selectedDateInfo = app.querySelector('#selected-date-info');
    const confirmationSection = app.querySelector('#confirmation-section');
    const confirmationDetails = app.querySelector('#confirmation-details');
    const bookingForm = app.querySelector('#booking-form');
    const cancelBookingBtn = app.querySelector('#cancel-booking');
    const successMessage = app.querySelector('#success-message');

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    // Funções que desenham ou atualizam a interface.

    function renderProfessionalInfo() {
        professionalHeader.name.textContent = state.professional.name;
        professionalHeader.specialty.textContent = state.professional.specialty;
    }

    function renderCalendar() {
        calendarContainer.innerHTML = '';
        const date = new Date(state.currentYear, state.currentMonth, 1);
        const monthName = date.toLocaleString('pt-BR', { month: 'long' });
        const year = date.getFullYear();

        const calendarHTML = `
            <div class="flex items-center justify-between mb-4">
                <button id="prev-month" class="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                <h3 class="font-semibold text-lg">${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}</h3>
                <button id="next-month" class="p-2 rounded-full hover:bg-gray-100">&gt;</button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                ${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => `<div>${day}</div>`).join('')}
            </div>
            <div id="calendar-grid" class="grid grid-cols-7 gap-1"></div>
        `;
        calendarContainer.innerHTML = calendarHTML;

        const calendarGrid = app.querySelector('#calendar-grid');
        const firstDayOfMonth = date.getDay();
        const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.innerHTML += '<div></div>';
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(state.currentYear, state.currentMonth, day);
            const isAvailable = state.professional.availability.weekdays.includes(currentDate.getDay());
            const isSelected = state.selectedDate && currentDate.getTime() === state.selectedDate.getTime();

            const dayElement = document.createElement('button');
            dayElement.textContent = day;
            dayElement.dataset.day = day;
            dayElement.classList.add('p-2', 'rounded-full', 'w-10', 'h-10', 'mx-auto', 'flex', 'items-center', 'justify-center', 'calendar-day');

            if (currentDate < today || !isAvailable) {
                dayElement.classList.add('text-gray-300', 'cursor-not-allowed');
                dayElement.disabled = true;
            } else {
                dayElement.classList.add('hover:bg-indigo-100');
            }
            if (isSelected) {
                dayElement.classList.add('selected');
            }
            calendarGrid.appendChild(dayElement);
        }
    }

    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        if (!state.selectedDate) {
            selectedDateInfo.textContent = '';
            slotsColumn.classList.add('hidden');
            if (window.innerWidth >= 768) slotsColumn.classList.remove('hidden'); // Garante que seja visível em telas maiores
            return;
        }
        
        slotsColumn.classList.remove('hidden');
        selectedDateInfo.textContent = `Horários para ${state.selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}`;

        const { startTime, endTime, slotInterval } = state.professional.availability;
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const dateKey = `${state.selectedDate.getFullYear()}-${String(state.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(state.selectedDate.getDate()).padStart(2, '0')}`;
        const busy = state.professional.busySlots[dateKey] || [];
        
        let currentTime = new Date(state.selectedDate);
        currentTime.setHours(startHour, startMinute, 0, 0);
        
        const endTimeDate = new Date(state.selectedDate);
        endTimeDate.setHours(endHour, endMinute, 0, 0);

        while(currentTime < endTimeDate) {
            const timeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
            if (!busy.includes(timeString)) {
                const slotElement = document.createElement('button');
                slotElement.textContent = timeString;
                slotElement.dataset.time = timeString;
                slotElement.classList.add('time-slot', 'text-sm', 'border', 'rounded-md', 'p-2', 'hover:bg-indigo-500', 'hover:text-white', 'transition-colors');
                timeSlotsContainer.appendChild(slotElement);
            }
            currentTime.setMinutes(currentTime.getMinutes() + slotInterval);
        }
    }
    
    function showConfirmation() {
        if(!state.selectedDate || !state.selectedTime) return;
        const dateText = state.selectedDate.toLocaleDateString('pt-BR', { dateStyle: 'full' });
        confirmationDetails.textContent = `Você está agendando uma consulta para ${dateText} às ${state.selectedTime}.`;
        confirmationSection.classList.remove('hidden');
        slotsColumn.classList.add('hidden');
    }

    function resetToSelection() {
        state.selectedTime = null;
        confirmationSection.classList.add('hidden');
        slotsColumn.classList.remove('hidden');
        document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
    }

    // --- LÓGICA DE EVENTOS ---
    calendarContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.id === 'prev-month') {
            state.currentMonth--;
            if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
            renderCalendar();
        } else if (target.id === 'next-month') {
            state.currentMonth++;
            if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
            renderCalendar();
        } else if (target.classList.contains('calendar-day') && !target.disabled) {
            const day = parseInt(target.dataset.day, 10);
            state.selectedDate = new Date(state.currentYear, state.currentMonth, day);
            state.selectedTime = null;
            document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
            target.classList.add('selected');
            renderTimeSlots();
            confirmationSection.classList.add('hidden');
        }
    });

    timeSlotsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('time-slot')) {
            state.selectedTime = target.dataset.time;
            document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
            target.classList.add('selected');
            showConfirmation();
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = app.querySelector('#clientName').value;
        const clientEmail = app.querySelector('#clientEmail').value;
        console.log('--- AGENDAMENTO REALIZADO (SIMULAÇÃO) ---');
        console.log({ ...state, clientName, clientEmail });
        confirmationSection.classList.add('hidden');
        successMessage.classList.remove('hidden');
    });

    cancelBookingBtn.addEventListener('click', resetToSelection);

    // --- INICIALIZAÇÃO ---
    function init() {
        renderProfessionalInfo();
        renderCalendar();
        renderTimeSlots();
    }

    init();
});
