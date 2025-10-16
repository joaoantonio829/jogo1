var altura = 0;
var largura = 0;
var vidas = 1;
var tempo = 15;
var criaMorcegoTempo = 1500;
var pontos = 0;
var intervaloMovimento = {};

var maxMunicao = 6;
var municaoAtual = maxMunicao;

var nivel = localStorage.getItem('nivelJogo');
localStorage.setItem('ponts', 0);

if (nivel === 'normal') {
    criaMorcegoTempo = 1500;
} else if (nivel === 'dificil') {
    criaMorcegoTempo = 1000;
} else if (nivel === 'chucknorris') {
    criaMorcegoTempo = 750;
}

function ajustaTamanhoPalcoJogo() {
    altura = window.innerHeight;
    largura = window.innerWidth;
}

ajustaTamanhoPalcoJogo();

function tamanhoAleatorio() {
    var numeroAleatorio = Math.floor(Math.random() * 3);
    switch (numeroAleatorio) {
        case 0: return { classe: "morcego1", arquivo: "1.png" };
        case 1: return { classe: "morcego2", arquivo: "2.png" };
        case 2: return { classe: "morcego3", arquivo: "3.png" };
    }
}

function ladoAleaorio() {
    var classe = Math.floor(Math.random() * 2);
    return classe === 0 ? "ladoA" : "ladoB";
}

function movimentoZigZag(morcegoElement, tempoDeVida) {
    let direcaoX = (Math.random() > 0.5) ? 1 : -1;
    let amplitudeY = 10; 
    let velocidadeX = 1.75;
    let contador = 0;
    
    const id = morcegoElement.id;
    let movimento;
    let timerDesaparece;

    const removerMorcego = (perdeVida = false) => {
        clearInterval(movimento);
        clearTimeout(timerDesaparece);
        
        if (morcegoElement.parentNode) morcegoElement.remove();
        delete intervaloMovimento[id];

        if (perdeVida) { 
            let vidaElement = document.getElementById('v' + vidas);
            if(vidaElement) vidaElement.src = "IMG/skull.png";
            vidas++;
            if (vidas > 3) window.location.href = "gameover.html";
        }
    };
    
    movimento = setInterval(() => {
        if (!document.getElementById(id)) {
            removerMorcego(false);
            return;
        }
        
        contador += 0.15; 
        
        let novaPosicaoY = parseInt(morcegoElement.style.top) + (Math.sin(contador) * amplitudeY);
        let novaPosicaoX = parseInt(morcegoElement.style.left) + (direcaoX * velocidadeX); 

        morcegoElement.style.top = novaPosicaoY + 'px';
        morcegoElement.style.left = novaPosicaoX + 'px';

    }, 20);

    intervaloMovimento[id] = movimento;

    timerDesaparece = setTimeout(() => {
        removerMorcego(false); 
    }, tempoDeVida); 
    
    return removerMorcego;
}

function posicaoRandomica() {
    
    var posicaoX = Math.floor(Math.random() * largura) - 90;
    var posicaoY = Math.floor(Math.random() * altura) - 90;

    posicaoX = posicaoX < 0 ? 0 : posicaoX;
    posicaoY = posicaoY < 0 ? 0 : posicaoY;

    var configMorcego = tamanhoAleatorio();

    var morcego = document.createElement('img');
    
    var idMorcego = 'morcego-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    morcego.id = idMorcego;
    
    morcego.src = "IMG/" + configMorcego.arquivo;
    morcego.style.left = posicaoX + "px";
    morcego.style.top = posicaoY + "px";
    morcego.style.position = "absolute";
    
    let tamanho;
    if (configMorcego.classe === 'morcego1') {
        tamanho = '90px';
    } else if (configMorcego.classe === 'morcego2') {
        tamanho = '120px';
    } else {
        tamanho = '150px';
    }
    morcego.style.width = tamanho;
    morcego.style.height = tamanho;

    document.body.appendChild(morcego);

    const tempoDeVida = criaMorcegoTempo * 3;

    const removerMorcego = movimentoZigZag(morcego, tempoDeVida);

    morcego.onclick = function() {
        if (municaoAtual <= 0) {
            return; 
        }

        var somDisparo = new Audio();
        somDisparo.src = 'IMG/disparo.mp3';
        somDisparo.play(); 
        
        municaoAtual--;
        atualizaPainelMunicao();

        if (this.classList.contains('morcego3')) {
            pontos += 1;
        } else if (this.classList.contains('morcego2')) {
            pontos += 2;
        } else {
            pontos += 3;
        }
        
        localStorage.setItem('ponts', pontos);
        
        var pontuacaoElement = document.getElementById("pontuacao");
        if(pontuacaoElement) {
            pontuacaoElement.innerHTML = pontos;
        }

        removerMorcego(false);
    }
}

function recarregar() {
    if (municaoAtual < maxMunicao) {
        var somRecarregar = new Audio('IMG/recarregar.mp3'); 
        somRecarregar.play(); 
        
        municaoAtual = maxMunicao;
        atualizaPainelMunicao();
    }
}

function atualizaPainelMunicao() {
    for (var i = 1; i <= maxMunicao; i++) {
        var bala = document.getElementById('m' + i);
        if (bala) {
            bala.style.opacity = (i <= municaoAtual) ? '1' : '0.3';
        }
    }
}

var cronometro = setInterval(function () {
    tempo -= 1;
    if (tempo < 0) {
        clearInterval(cronometro);
        for (const id in intervaloMovimento) {
            clearInterval(intervaloMovimento[id]);
        }
        
        var pontuacaoFinal = parseInt(localStorage.getItem('ponts'));
        var highscore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
        
        if (pontuacaoFinal > highscore) {
             localStorage.setItem('highScore', pontuacaoFinal);
        }

        window.location.href = "victory.html";
    } else {
        var cronometroElement = document.getElementById("cronometro");
        if (cronometroElement) {
             cronometroElement.innerHTML = tempo;
        }
    }
}, 1000);

var cronometroInit = document.getElementById('cronometro');
if(cronometroInit) {
    cronometroInit.innerHTML = tempo;
}
atualizaPainelMunicao();

setInterval(function(){
    posicaoRandomica();
}, criaMorcegoTempo);