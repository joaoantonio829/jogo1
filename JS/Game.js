let largura = window.innerWidth;
let altura = window.innerHeight;
let vidas = 1;
let tempo = 15;
let pontos = 0;
let criaMorcegoTempo = 1500;
let maxMunicao = 6;
let municaoAtual = 6;

let coins = parseInt(localStorage.getItem('userCoins') || 0);
let highscore = parseInt(localStorage.getItem('highScore') || 0);
let itemMunicaoDuplaAtivo = localStorage.getItem('item_municao_dupla') === 'true';

if (itemMunicaoDuplaAtivo) {
    maxMunicao *= 2; 
    localStorage.setItem('item_municao_dupla', 'false');
    municaoAtual = maxMunicao;
}

const nivel = localStorage.getItem('nivelJogo');
if (nivel === 'dificil') criaMorcegoTempo = 1000;
else if (nivel === 'chucknorris') criaMorcegoTempo = 750;

function ajustarTamanho() {
    largura = window.innerWidth;
    altura = window.innerHeight;
}
window.onresize = ajustarTamanho;

function adicionarCoins(qtd) {
    coins += qtd;
    localStorage.setItem('userCoins', coins);
}

function atualizaPainelMunicao() {
    for (let i = 1; i <= maxMunicao; i++) {
        const bala = document.getElementById('m' + i);
        if (bala) bala.style.opacity = (i <= municaoAtual) ? '1' : '0.3';
    }
}

function recarregar() {
    if (municaoAtual < maxMunicao) {
        new Audio('IMG/recarregar.mp3').play(); 
        municaoAtual = maxMunicao;
        atualizaPainelMunicao();
    }
}

function criarMorcego() {
    const random = Math.floor(Math.random() * 3);
    const config = (random === 0) ? { classe: "morcego1", arquivo: "1.png", tamanho: '90px', pontos: 3 } :
                   (random === 1) ? { classe: "morcego2", arquivo: "2.png", tamanho: '120px', pontos: 2 } :
                                    { classe: "morcego3", arquivo: "3.png", tamanho: '150px', pontos: 1 };

    const morcego = document.createElement('img');
    const id = 'morcego-' + Date.now();
    morcego.id = id;

    let x = Math.floor(Math.random() * largura) - 90;
    let y = Math.floor(Math.random() * altura) - 90;
    morcego.style.left = (x < 0 ? 0 : x) + "px";
    morcego.style.top = (y < 0 ? 0 : y) + "px";

    morcego.src = "IMG/" + config.arquivo; 
    morcego.className = config.classe + " " + (Math.random() > 0.5 ? "ladoA" : "ladoB"); 
    morcego.style.position = "absolute";
    morcego.style.width = config.tamanho;
    morcego.style.height = config.tamanho;
    document.body.appendChild(morcego);

    let velX = (Math.random() * 2) + 1;
    let dirX = (Math.random() > 0.5) ? 1 : -1;
    let dirY = (Math.random() > 0.5) ? 1 : -1;

    const movimento = setInterval(() => {
        let x = parseInt(morcego.style.left);
        let y = parseInt(morcego.style.top);
        
        let novoX = x + (dirX * velX);
        let novoY = y + (dirY * 1); 

        if (novoX > largura - 90 || novoX < 0) {
            
            const vidaElement = document.getElementById('v' + vidas);
            if(vidaElement) vidaElement.src = "IMG/skull.png";
            vidas++;
            
            clearInterval(movimento);
            morcego.remove();

            if (vidas > 3) window.location.href = "gameover.html";
            return;
        }
        
        if (novoY > altura - 90 || novoY < 0) dirY *= -1;

        morcego.style.left = novoX + 'px';
        morcego.style.top = novoY + 'px';

    }, 20);

    morcego.onclick = function() {
        if (municaoAtual <= 0) return; 

        new Audio('IMG/disparo.mp3').play(); 
        municaoAtual--;
        atualizaPainelMunicao();

        pontos += config.pontos;
        adicionarCoins(1);

        localStorage.setItem('ponts', pontos);
        
        const pontuacaoElement = document.getElementById("pontuacao");
        if(pontuacaoElement) pontuacaoElement.innerHTML = pontos;

        clearInterval(movimento);
        this.remove();
    }
}

setInterval(criarMorcego, criaMorcegoTempo);

const cronometro = setInterval(() => {
    tempo -= 1;
    if (tempo < 0) {
        clearInterval(cronometro);
        
        const pontuacaoFinal = parseInt(localStorage.getItem('ponts'));
        if (pontuacaoFinal > highscore) localStorage.setItem('highScore', pontuacaoFinal);

        window.location.href = "victory.html";
    } else {
        const cronometroElement = document.getElementById("cronometro");
        if (cronometroElement) cronometroElement.innerHTML = tempo;
    }
}, 1000);

const cronometroInit = document.getElementById('cronometro');
if(cronometroInit) cronometroInit.innerHTML = tempo;
atualizaPainelMunicao();