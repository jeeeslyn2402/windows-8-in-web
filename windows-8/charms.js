function loadComponent(selector, url) {
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        document.querySelector(selector).innerHTML = html;

        const charms = document.querySelector('.charms')
        let chday = document.getElementById('chday');
        let chdate = document.getElementById('chdate');
        const clock = document.getElementById('clock');

        const date = new Date(Date.now());
        const getDay = date.getDay();

        function updateClock() {
            const hours = date.getHours().toString().padStart(2, "0")
            const minutes = date.getMinutes().toString().padStart(2, "0")
            clock.textContent = `${hours}:${minutes}`;
        }

        setInterval(updateClock, 60000);
        updateClock();

        const getDate = date.getUTCDate();
        const getMonth = date.getUTCMonth();
        const monthname = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember'];
        const getMonthName = monthname[getMonth];

        const dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        chday.textContent = dayname[getDay];

        chdate.textContent = `${getMonthName} ${getDate}`;

        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');
        let isActive = false;
        
        function openCharmsSideBarPage(selectedPage, passivePage) {
            if (isActive) return;
            isActive = true;

            sidebar.classList.add('visible');
            overlay.classList.add('visible');
            charms.classList.remove('visible');
            document.querySelector(`.page.page-${selectedPage}`).classList.add('active');
            document.querySelector(`.page.page-${passivePage}`).classList.remove('active');

            requestAnimationFrame(() => {
                sidebar.style.animation = 'fadeInLeft2 .6s cubic-bezier(0.075, 0.82, 0.165, 1)'
                sidebar.addEventListener('animationend', () => {
                    if (sidebar.style.animation.includes('fadeInLeft')) {
                        isActive = false;
                    }
                })
            })
            
        }

        function closeCharmsSideBar() {
            if (isActive) return;
            isActive = true;

            overlay.classList.remove('visible');

            requestAnimationFrame(() => {
                sidebar.style.animation = 'fadeOutLeftWindows 1s cubic-bezier(0.075, 0.82, 0.165, 1)';
                sidebar.addEventListener('animationend', () => {
                    sidebar.classList.remove('visible');
                    isActive = false;
                }, {once: true})
            })
        }

        document.querySelector('#search').addEventListener('click', () => {
            openCharmsSideBarPage('search', 'settings');
        })
        document.querySelector('#settings').addEventListener('click', () => {
            openCharmsSideBarPage('settings', 'search');
        })

        document.querySelector('.overlay').addEventListener('click', closeCharmsSideBar);

        
        let currentPage = 0;
        const panelIndex = charms.querySelector('.index');

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
            const menuButton = event.target.closest(".menu-button");

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
        
        let isHovered = false;
        let isCharmsVisible = false;

        document.addEventListener('mousemove', (e) => {
            e.stopPropagation();
            if (!charms) return;

            const nearTop = e.clientY <= 2;
            const nearRight = e.clientX >= window.innerWidth - 10
            if (nearTop && nearRight && !isCharmsVisible) {

                isCharmsVisible = true;
                setTimeout(() => {
                    charms.classList.add('visible');
                }, 2000)
            }
        })
        
        charms.addEventListener('mousemove', (e) => {
            const pos = e.clientY;
            
            if (isCharmsVisible && pos >= 30) {
                charms.classList.add('hovered');
                isHovered = true;
            }
        })

        charms.addEventListener('mouseleave', (e) => {
            e.stopImmediatePropagation();

            if (isHovered) {
                isHovered = false;
                requestAnimationFrame(() => {
                    charms.style.animation = 'fadeOut .3s'
                })
                charms.addEventListener('animationend', () => {
                    charms.classList.remove(...['visible', 'hovered']);
                    charms.style.animation = '';
                    isCharmsVisible = false;
                    showIndexPage(0);
                }, {once: true})
            }
        })
        
        const imageList = [
            'default.png',
            'Alive%20Circuit.png',
            'Cartoon%20World.png',
            'Chocolate.png',
            'Curly%20Lines.png',
            'Diamonds.png',
            'Dragon.png',
            'Fish.png',
            'Flower%20Doodle.png',
            'Forest%20Land.png',
            'Gears.png',
            'Gleaming%20Flowers.png',
            'Jungle%20Creaturs.png',
            'Liquid%20Splash.png',
            'Paint.png',
            'Pattern.png',
            'Plane%20Paper.png',
            'Robots.png',
            'Sky%20Night.png',
            'Swirling%20Tiles.png',
            'Tile%20Circles.png',
            'Town.png',
            'Upon%20The%20Branch.png',
            'Waves.png',
            'Wavy%20Leafs.png'
        ]

        const container = document.getElementById('img-container');
        const selectedImage = localStorage.getItem('bg');
        
        imageList.forEach(filename => {
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('image-box');
            imgDiv.style.backgroundImage = `url(/assets/start-background/${filename})`;

            imgDiv.addEventListener('click', () => {
                const saved = document.documentElement.style.backgroundImage = `url(/assets/start-background/${filename})`;
                localStorage.setItem('bg', saved)
            })

            container.appendChild(imgDiv);

            if (selectedImage) {
                document.documentElement.style.backgroundImage = selectedImage;
            } else {
                document.documentElement.style.backgroundImage = `url(/assets/start-background/default.png)`
            }
        })

        const appTitle = document.getElementById('app-title');
        appTitle.textContent = document.title;

    })
    .catch(error => {
        console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#charms-wrapper', '/windows-8/charms.html');
});
