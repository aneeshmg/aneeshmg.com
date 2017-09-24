console.log('Loaded..')

var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight
});
function load() {
    document.body.background = pattern.png()
}

load()