const socket = io();

const resultsList = document.getElementById("results");

const elements = new Map();

socket.on("results", (data) => {
    data.sort((a, b) => b.votes - a.votes);

    const totalVotes = data.reduce((sum, c) => sum + c.votes, 0);

    const firstPositions = new Map();
    elements.forEach((el, id) => {
        firstPositions.set(id, el.getBoundingClientRect());
    });

    data.forEach((course, index) => {
        let el = elements.get(course.id);

        const percentage = totalVotes
            ? ((course.votes / totalVotes) * 100).toFixed(1)
            : 0;

        if (!el) {
            el = document.createElement("li");
            el.className = "card";
            elements.set(course.id, el);
            resultsList.appendChild(el);
        }

        el.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <h2>${course.name}</h2>
            <p><strong>${course.votes}</strong> votes</p>
            <p>${percentage}%</p>
            <div class="bar">
                <div class="fill" style="width:${percentage}%"></div>
            </div>
        `;

        resultsList.appendChild(el);
    });

    elements.forEach((el, id) => {
        const first = firstPositions.get(id);
        const last = el.getBoundingClientRect();

        if (!first) return;

        const dx = first.left - last.left;
        const dy = first.top - last.top;

        if (dx || dy) {
            el.style.transform = `translate(${dx}px, ${dy}px)`;

            requestAnimationFrame(() => {
                el.style.transition = "transform 0.5s ease";
                el.style.transform = "";
            });
        }
    });
});