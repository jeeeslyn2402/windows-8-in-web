const starts = document.querySelectorAll('.start-button');

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const appBars = document.querySelectorAll('.app-bar');
    appBars.forEach(appBar => {
        appBar.classList.add('visible');
    })
    if (appBars instanceof HTMLDivElement) {
    }
})

starts.forEach(start => {
    start.addEventListener('click', () => {
        window.location.href = '/windows-8/start.html'
    });
})

document.addEventListener('keydown', (e) => {
    e.stopPropagation();
    
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        window.location.href = window.location.ancestorOrigins + '/start.html'
    }
})

const taskbar = document.querySelector('.taskbar');
let isTaskbarVisible = false;

document.addEventListener('mousemove', (e) => {
    e.preventDefault();

    if (e.pageX === 0 && e.pageY < window.innerHeight) {
        taskbar.classList.add('visible');
        isTaskbarVisible = true;
    }

    taskbar.addEventListener('mouseleave', (e) => {
        e.stopImmediatePropagation();

        requestAnimationFrame(() => {
            taskbar.style.animation = 'fadeOut .3s';
            taskbar.addEventListener('animationend', () => {
                taskbar.style.animation = '';
                taskbar.classList.remove('visible');
                isTaskbarVisible = false;
            }, {once: true})
        })
    });

    const ctxmenu = document.getElementById('ctxmenu');
    ctxmenu.addEventListener('click', (e) => {
        e.stopPropagation();
    })
    let currentTarget = null;

    if (ctxmenu) {

        function hideMenu() {
            ctxmenu.style.display = 'none';
        }
    }


    document.addEventListener('click', (e) => {
        hideMenu();
        if (!ctxmenu.contains(e.target)) {
            ctxmenu.style.display = 'none';
            currentTarget = null;
        }
    });

})

window.onload = () => {
    window.scrollTo(0,0);
    const h1s = document.querySelectorAll('.header h1');
    const actions = document.querySelector('.header .actions-button');
    h1s.forEach(h1 => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                h1.classList.add('visible');
                h1.style.animation = 'fadeInLeft .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
                h1.addEventListener('animationend', () => {
                    h1.style.animation = ''
                })
            }, {once: true})
        }, 300)
        requestAnimationFrame(() => {
            actions.classList.add('visible');
            actions.style.animation = 'fadeInRight .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
            actions.addEventListener('animationend', () => {
                actions.style.animation = ''
            })
        }, {once: true})
    })

    const splashScreens = document.querySelectorAll('.splash-screen');
    const content = document.querySelector('section');
    splashScreens.forEach(splash => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                splash.style.animation = 'fadeOut .2s';
                content.style.display = 'block';
                splash.addEventListener('animationend', () => {
                    splash.style.display = 'none';
                })
            })
        }, 3000)
    })

    function addTiltEffect(elements) {
        elements.forEach(elem => {
            elem.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
    
                const rotateX = -(y - centerY) / 10;
                const rotateY = (x - centerX) / 10;
    
                elem.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.97)`;
                elem.style.transform += 'scale(0.97)';
                elem.style.transition = 'transform .1s cubic-bezier(0.075, 0.82, 0.165, 1)'
            });
            elem.addEventListener('mouseleave', () => {
                elem.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            })
            elem.addEventListener('mouseup', () => {
                elem.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            })
        })
    }

    const elements = document.querySelectorAll('.flex .caption-container, .gallery-item');
    addTiltEffect(elements);


    let currentPage = 0;
    
    function showIndexPage(page) {
        document.querySelector(".index-" + currentPage).classList.remove("active");
        currentPage = page;
        document.querySelector(".index-" + currentPage).classList.add("active");
    }
    function backtoMain() {
        document.querySelector('.index-' + currentPage).classList.remove('active');
        currentPage = 0;
        document.querySelector('.index-' + currentPage).classList.add('active');
    }

    document.addEventListener("click", (event) => {
        const menuButton = event.target.closest(".elem-container");

        if (event.target.closest(".back-btn")) {
            backtoMain();
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
        }

        if (menuButton) {
            const targetPage = menuButton.getAttribute("data-target");
            // Tentukan indeks halaman berdasarkan data-target (misalnya "index1", "index2")
            if (event.currentTarget.contains(event.target)) {
                if (targetPage === "index0") {
                    showIndexPage(0);
                    
                } else if (targetPage === "index1") {
                    showIndexPage(1);
                    
                } else if (targetPage === "index2") {
                    showIndexPage(2);
                    
                }

            }
        }
    });

    const show = document.querySelector('.show');

    setInterval(() => {
        requestAnimationFrame(() => {
            show.style.animation = 'fadeIn .5s'
            document.querySelector('.loading').classList.add('hidden');
            show.classList.remove('hidden');

        })
    }, 10000)

        
    const imgs = [
        'jo_yu_ri-1.webp',
        'jo_yu_ri-2.webp',
        'Jo_yu-ri_3.webp',
        'Jo_yu-ri_4.webp'
    ]

    const container = document.getElementById('gallery');

    imgs.forEach(filename => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('gallery-item');
        imgDiv.style.backgroundImage = `url(/assets/special/jo%20yu-ri/${filename})`;

        container.appendChild(imgDiv);
    })
}

let element = document.querySelectorAll('[data-tooltip]');
console.log(`found elements tooltip: ${element.length}`)

const tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
document.body.appendChild(tooltip);

element.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        tooltip.textContent = elem.dataset.tooltip || 'No tooltip text';
        tooltip.style.display = 'block';
        tooltip.style.left = '-9999px';
        tooltip.style.top = '-9999px';
        
        requestAnimationFrame(() => {
            const rect = elem.getBoundingClientRect();
            let left = rect.left + window.scrollX / 0.5;
            let top = rect.top + window.scrollY - tooltip.offsetHeight - 12;
            left += (rect.width - tooltip.offsetWidth) / 2;
            
            if (top < window.scrollY) {
                top = rect.bottom + window.scrollY + 15;
            }

            if (left < window.scrollX) {
                left += rect.left + window.scrollX + 15;
            } 

            const maxRight = window.scrollX + window.innerWidth;
            const rightEdge = left + tooltip.offsetWidth;
            
            if (rightEdge > maxRight) {
                left = maxRight - tooltip.offsetWidth - 35;
            }
            tooltip.style.left = `${left / 0.5}px`;
            tooltip.style.top = `${top / 0.5}px`

        })


    })

    elem.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
    
})

function showTab(tab) {
    const tabs =  document.querySelectorAll('.pane-content .nav-page');
    const buttons = document.querySelectorAll('.nav-buttons .menuButton');

    tabs.forEach(tab => tab.classList.remove('active'));

    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tab).classList.add('active');

    document.querySelector(`#${tab}-tab`).classList.add('active');
}

function showPanel(tab) {
    const panels = document.querySelectorAll('.panel-content, .flat-page')
    const buttons = document.querySelectorAll('.tab-button');

    panels.forEach(tab => tab.classList.remove('active'));

    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tab).classList.add('active');

    document.querySelector(`#${tab}-button`).classList.add('active');

    history.replaceState(null, null, `#${tab}`);
}

const darkModeToggle = document.getElementById('darkModeToggle');
const isChecked = localStorage.getItem('checked') === "true";

if (isChecked) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', (e) => {
    e.preventDefault();

    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('checked', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('checked', 'false');
    }
})