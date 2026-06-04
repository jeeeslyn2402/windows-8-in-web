setTimeout(() => {
    document.querySelector('.windows-loader').style.display = 'inline';
}, 3000)

const url = window.location.search; 
const params = new URLSearchParams(url);


if (params.has('ssd')) {
    const isSSDEnabled = params.get('ssd');
    if (isSSDEnabled === "true") {
        setTimeout(() => {
            document.querySelector('.boot-container').style.display = 'none';
        }, 6000)

        setTimeout(() => {
            window.location.href = '/windows-8/logonui.html?ssd=true';   
        }, 7000)

    } else if (isSSDEnabled === "false") {
        setTimeout(() => {
            document.querySelector('.boot-container').style.display = 'none';
        }, 10000)

        setTimeout(() => {
            window.location.href = '/windows-8/logonui.html';   
        }, 12000)
    }
} else {
    setTimeout(() => {
        document.querySelector('.boot-container').style.display = 'none';
    }, 10000)

    setTimeout(() => {
        window.location.href = '/windows-8/logonui.html';   
    }, 12000)
}