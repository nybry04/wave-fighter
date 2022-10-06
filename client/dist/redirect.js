if(window.localStorage.getItem('state') === null) {
    window.location.href = '/startgame.html'
}else if(window.localStorage.getItem('state') === 'endgame') {
    if(window.location.pathname !== '/endgame.html')
        window.location.href = '/endgame.html'
}