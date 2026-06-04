const container = document.querySelector('.user-container');
const url = window.location.search; 
const params = new URLSearchParams(url);

if (params.has('ssd')) {
    const isSSDEnabled = params.get('ssd');
    if (isSSDEnabled === "true") {
        setTimeout(() => {
            requestAnimationFrame(() => {
                container.style.animation = 'fadeOutLeftWindows .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
        
                setTimeout(() => {
                    window.location.replace('/windows-8/start.html');
                }, 500)
        
            })
        }, 4000)
    } else if (isSSDEnabled === "false") {
        setTimeout(() => {
            requestAnimationFrame(() => {
                container.style.animation = 'fadeOutLeftWindows .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
        
                setTimeout(() => {
                    window.location.replace('/windows-8/start.html');
                }, 500)
        
            })
        }, 10000)
    }
} else {
    setTimeout(() => {
        requestAnimationFrame(() => {
            container.style.animation = 'fadeOutLeftWindows .7s cubic-bezier(0.075, 0.82, 0.165, 1)';
    
            setTimeout(() => {
                window.location.replace('/windows-8/start.html');
            }, 500)
    
        })
    }, 12000)
}