const imgs = document.querySelectorAll('.modern-cards .img img');
imgs.forEach(img => img.setAttribute('draggable', 'false'));

const sections = document.querySelectorAll('.modern-cards');
const columns = new Map();
const flexGrids = document.querySelectorAll('.flex-grid');

sections.forEach(card => {
    const newOverlay = document.createElement('div');
    newOverlay.classList.add('acrylic')
    card.appendChild(newOverlay);

    const acrylic = card.querySelector('.acrylic');

    card.setAttribute("draggable", true)
    card.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', card.id);
    })
    
    card.addEventListener('mousedown', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 8;
        const centerY = rect.height / 8;

        const rotateX = -(y - centerY) / 10;
        const rotateY = (x - centerX) / 10;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.97)`;
        card.style.transform += 'scale(0.97)';
        card.style.transition = 'transform .1s cubic-bezier(0.075, 0.82, 0.165, 1)';
    });
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        acrylic.style.left = `${x}px`;
        acrylic.style.top = `${y}px`;
        acrylic.style.opacity = 1;
    })
    card.addEventListener('mouseleave', () => {
        acrylic.style.opacity = 0;
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    })
    card.addEventListener('mouseup', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    })

    let draggedCard = null;

    const groups = document.querySelectorAll('.group-content');

    groups.forEach(group => {
        document.addEventListener('DOMContentLoaded', () => {
            const h1s = document.querySelectorAll('.group h1');
            const savedHeadingText = JSON.parse(localStorage.getItem('group-heading') || '{}');

            h1s.forEach((h1, index) => {
                let uuid = h1.dataset.groupId;
            
                if (!uuid) {
                    uuid = localStorage.getItem(`group-uuid-${index}`);
                    if (!uuid) {
                        uuid = crypto.randomUUID();
                        localStorage.setItem(`group-uuid-${index}`, uuid);
                    }
                    h1.setAttribute('data-group-id', uuid);
                }

                const id = h1.getAttribute('data-group-id');

                if (savedHeadingText[id]) {
                    h1.innerHTML = savedHeadingText[id];
                }

                h1.addEventListener('focusout', () => {
                    savedHeadingText[id] = h1.innerHTML;
                    localStorage.setItem('group-heading', JSON.stringify(savedHeadingText));
                })
                
                h1.addEventListener('keydown', (e) => {
                    if (e.keyCode === 13 || e.key === 'Enter') {
                        e.preventDefault();
                        h1.blur();
                    }
                })
            })
        })

        group.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.dataTransfer.dropEffect = 'move';
        });

        group.addEventListener('dragstart', (e) => {
            draggedCard = e.target;
            if (e.target.classList.contains('modern-cards')) {
                var crt = this.cloneNode(true);
                e.dataTransfer.setData('text/plain', e.target.id);
                e.dataTransfer.setDragImage(crt, 0, 0)
            }
        });
        
        card.addEventListener('dragstart', (e) => {
            draggedCard = e.target;
            e.dataTransfer.setData('text/plain', e.target.id);
        })

        group.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('modern-cards')) {
                draggedCard = null;
            }
        });

        group.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (draggedCard === null) return;

            if (draggedCard && !group.contains(draggedCard)) {
                group.appendChild(draggedCard);
            }

            const afterElement = getDragAfterElement(group, e.clientY);

            if (!afterElement) {
                if (group.lastChild !== draggedCard) {
                    group.appendChild(draggedCard);
                }
            } else {
                if (afterElement !== draggedCard && afterElement.previousElementSibling !== draggedCard) {
                    group.insertBefore(draggedCard, afterElement);
                }
            }
            
            draggedCard = null;
            
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.modern-cards')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return {offset: offset, element: child};
                } else {
                    return closest;
                }
            }, {offset: Number.NEGATIVE_INFINITY}).element;
            
        }
    })
})

let delay = 0;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const addDelay = delay;
        delay += 40;
        setTimeout(() => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.pointerEvents = 'auto';
                entry.target.style.transform = "scale(1) translateX(0)";
                observer.unobserve(entry.target);

            }
        }, addDelay)
        
    });
});

const startpage = document.querySelector('.page.start');
const flex = startpage.querySelector('.flex-grid');
const starts = document.querySelectorAll('.start-button');
const cards = flex.querySelectorAll('.modern-cards');
const cardReverse = Array.from(cards).reverse();
const pages = document.querySelectorAll('.page');
const appsPages = document.querySelectorAll('.apps');

function isStart() {
    starts.forEach(start => {
        start.addEventListener('click', () => {
            
            const isActive = Array.from(pages).find(page => page.querySelector('.start')?.classList.contains('active'));

            if (isActive) {
                hideTile();
            } else {
                gotoStartPage();
            }
        })
    })
}

function hideTile() {
    let count = 0;
    let delay = 0;

    cardReverse.forEach(card => {
        setTimeout(() => {
            observer.unobserve(card);
            card.style.transform = "scale(0.9) translateX(100px)";
            card.style.opacity = 0;
        }, delay)
        
        delay += 40;
                        
        const onTransitionEnd = () => {
            count++;

            card.removeEventListener('transitionend', onTransitionEnd);

            if (count === cardReverse.length) {
                flex.classList.add('hidden');
                delay = 0;
            }

        }
        card.addEventListener('transitionend', onTransitionEnd)
    }) 
}

function showTile() {
    flex.classList.remove('hidden');
    cards.forEach(card => {
        observer.observe(card);
        card.style.opacity = 0;
        card.style.transform = "scale(0.8) translateX(200px)";
    })
}

function openIndexedPage(pageIndex) {
    startpage.classList.remove('active');
    hideTile();
    appsPages.forEach((page, index) => {
        page.classList.toggle('active', index === pageIndex);
    })
        
}

document.getElementById('apps').addEventListener('click', () => {
    openIndexedPage();
})

function toggleStartPage() {
    const isStartActive = startpage.classList.contains('active');
    const isFlexHidden = flex.classList.contains('hidden')
    if (isStartActive && !isFlexHidden) {
        hideTile();
        setTimeout(() => {
            startpage.classList.remove('active')
        }, 2000)
    } else {
        startpage.classList.add('active');
        showTile();
        appsPages.forEach(app => app.classList.remove('active'))
    }
}
        
function gotoStartPage() {
    pages.forEach(page => {
        if (!startpage.classList.contains('active')) {
             requestAnimationFrame(() => {
            startpage.style.animation = 'fadeInLeftCustom .7s cubic-bezier(0.075, 0.82, 0.165, 1)'

            startpage.addEventListener('animationend', () => {
                startpage.classList.add('active');
            }, {once: true})
        })
            page.querySelector('.apps')?.classList.remove('active');
        } else {
            startpage.classList.remove('active');
            page.querySelector('.apps')?.classList.add('active');
        }
    })
}

starts.forEach(start => {
    start.addEventListener('click', toggleStartPage);
})

const taskbar = document.querySelector('.taskbar');
let isTaskbarVisible = false;

document.addEventListener('mousemove', (e) => {
    e.preventDefault();

    if (e.pageX === 0 && e.pageY > window.scrollY) {
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
})


sections.forEach((card, index) => {
    observer.observe(card);

    let min = Math.ceil(30000);
    let max = Math.floor(40000);
    let imageDelay = Math.floor(Math.random() * (max - min + 1) + min);

    setInterval(() => {
        const images = card.querySelectorAll('.dev-img');

        if (flex.classList.contains('hidden')) {
            images.forEach(img => img.style.animation = 'none');
            return false;
        } else {
            images.forEach(img => img.style.animation = 'fadeInUpCustom 2.2s cubic-bezier(1,0,0,1)')
            const currentIndex = [...images].findIndex(img => img.classList.contains('active'));
            
            images[currentIndex].classList.remove('active');
            images[currentIndex].style.zIndex = 0;

            const nextIndex = (currentIndex + 1) % images.length;
            images[nextIndex].classList.add('active');
            images[nextIndex].style.zIndex = 1;            
        }


        

            
    }, imageDelay)

    const ctxmenu = document.getElementById('ctxmenu');
    const actionButtons = document.querySelectorAll('.header .actions-button button');
    const ctxtype = document.querySelector('.ctx-type');

    ctxmenu.addEventListener('click', (e) => {
        e.stopPropagation();
    })

    let currentTarget = null;

    if (ctxmenu) {
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            currentTarget = card;
            
            ctxmenu.style.left = `${e.pageX / 0.5}px`;
            ctxmenu.style.top = `${e.pageY / 0.5}px`;
            ctxmenu.style.display = 'block';
            requestAnimationFrame(() => {
                ctxmenu.style.animation = 'fadeInDown .4s cubic-bezier(0.075, 0.82, 0.165, 1)';
            });
            
            document.querySelectorAll('.ctx-type.power, .ctx-type.user').forEach(type => type.classList.remove('active'));
            document.querySelector('.ctx-type.tile-ctxmenu').classList.add('active');
        })
        
        actionButtons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                ctxmenu.style.top = `210px`;
                requestAnimationFrame(() => {
                    ctxmenu.style.animation = 'fadeInDown .4s cubic-bezier(0.075, 0.82, 0.165, 1)';
                }, {once: true});
                
                document.querySelector('.ctx-type.tile-ctxmenu').classList.remove('active');

                switch(btn.id) {
                    case 'user':
                        ctxmenu.style.display = 'block';
                        document.querySelector('.ctx-type.user').classList.add('active');
                        document.querySelector('.ctx-type.power').classList.remove('active');
                        ctxmenu.style.left = `calc(100% - 24%)`
                    break;
                    case 'power':
                        ctxmenu.style.display = 'block';
                        document.querySelector('.ctx-type.user').classList.remove('active');
                        document.querySelector('.ctx-type.power').classList.add('active');
                        ctxmenu.style.left = `calc(100% - 18%)`
                    break;
                }
            })
        })

        function hideMenu() {
            ctxmenu.style.display = 'none';
        }

        const normalTile = document.getElementById('normalTile');
        const wideTile = document.getElementById('wideTile');
        const smallTile = document.getElementById('smallTile');
        const largeTile = document.getElementById('largeTile');
        const verticalBanner = document.getElementById('verticalBanner');
        const horizontalBanner = document.getElementById('horizontalBanner');
        
        let uuid = card.dataset.cardId;
        
        if (!uuid) {
            uuid = localStorage.getItem(`card-uuid-${index}`);
            if (!uuid) {
                uuid = crypto.randomUUID();
                localStorage.setItem(`card-uuid-${index}`, uuid);
            }
            card.setAttribute('data-card-id', uuid);
        }
        document.addEventListener('DOMContentLoaded', () => {

            const sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
            
            Object.entries(sizes).forEach(([id, size]) => {
                const target = document.querySelector(`.modern-cards[data-card-id="${id}"]`);
                if (target) {
                    target.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                    target.classList.add(size);
                }
            })
        })
        
        smallTile.addEventListener('click', (e) => {
            if (currentTarget) {
                const id = currentTarget.getAttribute('data-card-id');
                currentTarget.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                currentTarget.classList.add('smalltile')

                let sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
                sizes[id] = 'smalltile';
                localStorage.setItem('cardSize', JSON.stringify(sizes));
            }
        })
        normalTile.addEventListener('click', (e) => {
            if (currentTarget) {
                const id = currentTarget.getAttribute('data-card-id');
                currentTarget.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                currentTarget.classList.add('normaltile')

                let sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
                sizes[id] = 'normaltile';
                localStorage.setItem('cardSize', JSON.stringify(sizes));
            }
        })
        wideTile.addEventListener('click', (e) => {
            if (currentTarget) {
                const newSize = 'widetile'
                const id = currentTarget.getAttribute('data-card-id');
                currentTarget.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                currentTarget.classList.add(newSize);

                let sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
                sizes[id] = newSize;
                localStorage.setItem('cardSize', JSON.stringify(sizes));
            }
        })
        largeTile.addEventListener('click', (e) => {
            if (currentTarget) {
                const id = currentTarget.getAttribute('data-card-id');
                currentTarget.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                currentTarget.classList.add('largetile');

                let sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
                sizes[id] = 'largetile';
                localStorage.setItem('cardSize', JSON.stringify(sizes));
            }
        })
        verticalBanner.addEventListener('click', (e) => {
            if (currentTarget) {
                const id = currentTarget.getAttribute('data-card-id');
                currentTarget.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                currentTarget.classList.add('vertical-banner');

                let sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
                sizes[id] = 'vertical-banner';
                localStorage.setItem('cardSize', JSON.stringify(sizes));
            }
        })
        horizontalBanner.addEventListener('click', (e) => {
            if (currentTarget) {
                const id = currentTarget.getAttribute('data-card-id');
                currentTarget.classList.remove('smalltile', 'normaltile', 'widetile', 'largetile', 'vertical-banner', 'horizontal-banner');
                currentTarget.classList.add('horizontal-banner');

                let sizes = JSON.parse(localStorage.getItem('cardSize') || '{}');
                sizes[id] = 'horizontal-banner';
                localStorage.setItem('cardSize', JSON.stringify(sizes));
            }
        })

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
    function setWebIcon(iconUrl) {
        let link = document.querySelector("link[rel~='icon']");
    
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }

        link.href = iconUrl;
    }
    setWebIcon("./assets/icon/replOS Icon.png");

    const h1s = document.querySelectorAll('.header h1');
    const groupH1s = document.querySelectorAll('.group-heading');
    const actions = document.querySelector('.header .actions-button');
    requestAnimationFrame(() => {
        actions.classList.add('visible');
        actions.style.animation = 'fadeInRight .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
        actions.addEventListener('animationend', () => {
            actions.style.animation = ''
        }, {once: true})
    })

    h1s.forEach((h1, index) => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                h1.classList.add('visible');
                h1.style.animation = 'fadeInLeft .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
                h1.addEventListener('animationend', () => {
                    h1.style.animation = '';
                    groupH1s.forEach(groupH1 => {
                        setTimeout(() => {
                            requestAnimationFrame(() => {
                                groupH1.style.animation = 'fadeIn .3s cubic-bezier(0.075, 0.82, 0.165, 1)';
                                groupH1.classList.add('visible');
                            });
                        }, 1000)
                    })
                });

            });
        }, 1500)
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
            let left = rect.left + window.scrollX;
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