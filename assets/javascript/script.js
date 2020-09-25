let dados = {email : "", password : ""}
let token = "";
var countP = 0;
var countN = 0;
let pergunta = [];
let nivel = [];
let quiz = {};
const urlPostUsuario = "https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/users";
const urlPostQuiz = "https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes";
const urlGetQuiz = "https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes";


function conferirCamposLogin(){

     dados.email = document.querySelector(".campoEmail").value;
     dados.password = document.querySelector(".campoSenha").value;

     let login = dados.email;
     let senha = dados.password;

    if(login === "" || senha === ""){

        alert("Preencha todos os campos!")

        return;
    }    

    cadastro();    
}

function processarEnter(e){
    if (e.keyCode == 13) {
        conferirCamposLogin();
        return false;
    }
}

function cadastro(){

    var btnEntrar = document.querySelector(".entrar");
    btnEntrar.disabled = true;

    var requisição = axios.post(urlPostUsuario, dados)
    
    requisição.then(processaCadastro).catch(trataErroCadastro)
}

function processaCadastro(resposta){

    var btnEntrar = document.querySelector(".entrar");
    btnEntrar.disabled = false;

    token = resposta.data.token;    

    mudandoParaQuizzes();
    carregandoQuizzes();
   // setTimeout(carregandoQuizzes, 250);
}

function trataErroCadastro(){
    alert("Usuário/Senha Incorretos!");
    window.location.reload()
}

function mudandoParaQuizzes(){
    
    var telaInicial = document.querySelector("body > header");
    var telaQuizzes = document.querySelector(".menu-quizzes");

    telaInicial.classList.add("fade-out");    

    telaQuizzes.classList.add("fade-in");
    telaQuizzes.style.display = "block";
}

function carregandoQuizzes(){    
    var quizzes = axios.get(urlGetQuiz, {headers : {"User-token" : token}});
    quizzes.then(processaQuizzes).catch(trataErroMenu)
}

function trataErroMenu(){
    alert("Fatal Error: Falha no carregamento dos quizzes!");
    window.location.reload()
}

function processaQuizzes(info){   

    var dados = info.data;
    var quizNode = document.querySelector(".container-quizzes");
    
    quizNode.innerHTML = "";

    let liNovo = document.createElement("li");
    liNovo.classList.add("novo-quizz");
    liNovo.innerHTML = "<strong>Novo<br>Quizz</strong>";
    liNovo.innerHTML += "<button><ion-icon class='add-icon' onclick='mudandoParaCriacao()' name='add-circle'></ion-icon></button>";
    quizNode.appendChild(liNovo);

    for(var i = 0; i < dados.length; i++){

        let li = document.createElement("li");
        li.classList.add("quizz-adicionado");
        li.setAttribute("onclick", "abreQuiz(this)");
        li.setAttribute("id", dados[i].id);
        li.innerHTML = `<p>${dados[i].title}</p>`;

        quizNode.appendChild(li);
    }
   
}

function mudandoParaCriacao(){
    var menuQuizzes = document.querySelector(".menu-quizzes");
    var criarQuiz = document.querySelector(".criar-quiz");
    
    menuQuizzes.classList.remove("fade-in");
    menuQuizzes.classList.add("fade-out");
    
    criarQuiz.classList.add("fade-in");
    criarQuiz.style.display = "block";

    renderizaPerguntas();
    renderizaNiveis();
    
    
}

function renderizaPerguntas(){

    countP++; 

    let div = document.createElement("div");
    let perguntaNode = document.querySelector(".container-pergunta");
    let ID = `p${countP}`;
       
    div.classList.add("pergunta");    
    div.setAttribute("id", ID);

    div.innerHTML = `<h1>Pergunta ${countP}</h1>`;
    div.innerHTML += `<input class="inputPergunta" type="text" placeholder="Digite a pergunta">`;
    div.innerHTML += `<div class="certo-errado">
    <input class="certo" type="text" placeholder="Resposta correta">
    <input class="certo" type="text" placeholder="Link correto"> 
    <input class="errado" type="text" placeholder="Errada 1">
    <input class="errado" type="text" placeholder="Link errado 1">
    <input class="errado" type="text" placeholder="Errada 2">
    <input class="errado" type="text" placeholder="Link errado 2">
    <input class="errado" type="text" placeholder="Errada 3">
    <input class="errado" type="text" placeholder="Link errado 3">
    </div>`

    perguntaNode.appendChild(div);
    
    //console.log(countP)
}

function renderizaNiveis(){

    countN++

    let div = document.createElement("div");
    let nivelNode = document.querySelector(".container-nivel");
    let ID = `n${countN}`;

    div.classList.add("nivel");
    div.setAttribute("id", ID);

    div.innerHTML = `<h1>Nivel ${countN}</h1>`;
    div.innerHTML += `<div class="faixaAcerto">
    <input type="text" placeholder="% mín. do nível">
    <input type="text" placeholder="% máx. do nível">
    </div>`;
    div.innerHTML += `<input type="text" placeholder="Título do nível">`;
    div.innerHTML += `<input type="text" placeholder="Link da imagem">`;
    div.innerHTML += `<input type="text" placeholder="Descrição do nível">`;

    nivelNode.appendChild(div);
    
}

function voltandoMenu(info){      

    console.log(info.data)

    var menuQuizzes = document.querySelector(".menu-quizzes");
    var criarQuiz = document.querySelector(".criar-quiz");

    //deve ser executado depois 
    //de receber OK do server no envio do Quiz
    let perguntaNode = document.querySelector(".container-pergunta");
    let nivelNode = document.querySelector(".container-nivel");    
    perguntaNode.innerHTML = "";
    nivelNode.innerHTML = "";
    countN = 0;
    countP = 0;
    pergunta = [];
    nivel = [];
    quiz = {};
    //------------------------------------------

    menuQuizzes.classList.remove("fade-out");
    menuQuizzes.classList.add("fade-in");
    
    criarQuiz.classList.remove("fade-in");
    criarQuiz.classList.add("fade-out");
    criarQuiz.style.display = "none";
    
    carregandoQuizzes();
}

function salvaPerguntaQuiz(){
    
    for(var i = 1; i <= countP; i++){

        let resp = { 
            "resposta" : "",
            "linkResposta" : "",
            "flag" : false };
        
        let Resposta = [];

        let perg = {
            "tituloPergunta" : "",
            "Respostas" : Resposta};    

        var ID = `#p${i}`;
        var elemento = document.querySelector(ID);
        //Pega todos os inputs de cada bloco de pergunta
        var inputs = elemento.querySelectorAll(".certo-errado input");
        var inputPergunta = elemento.querySelector(".inputPergunta").value;

        for( var j = 0; j < 4; j++){

            let resp = { 
                "resposta" : "",
                "linkResposta" : "",
                "flag" : false };

            if(j == 0){
                resp.flag = true;
            }

            resp.resposta = inputs[(2 * j)].value;
            resp.linkResposta = inputs[((2 * j) + 1)].value            

            Resposta.push(resp);

        }

        perg.tituloPergunta = inputPergunta;

        pergunta.push(perg);
    }
}

function salvaNivelQuiz(){

    for(var i = 1; i <= countN; i++){

        let niv = {
            "rangeMin" : "",
            "rangeMax" : "",
            "tituloNivel" : "",
            "linkNivel" : "",
            "desc" : ""
        };

        var ID = `#n${i}`;
        var elemento = document.querySelector(ID);
        var inputs = elemento.querySelectorAll("input");        

        niv.rangeMax = inputs[0].value;
        niv.rangeMax = inputs[1].value;
        niv.tituloNivel = inputs[2].value;
        niv.linkNivel = inputs[3].value;
        niv.desc = inputs[4].value;

        nivel.push(niv)
        
    }
}

function montaQuiz(){

    var inputTitulo = document.querySelector(".inputTitulo").value;

    quiz = {
        "title" : inputTitulo,
        "data" : {pergunta, nivel}
    }

    inputTitulo = "";

}

function enviaQuizzServidor(){

    salvaPerguntaQuiz();
    salvaNivelQuiz();  
    montaQuiz();

    var enviandoQuiz = axios.post(urlPostQuiz, quiz, {headers : {"User-token" : token}});
    enviandoQuiz.then(voltandoMenu).catch(trataErroEnvio);

}

function trataErroEnvio(err){
    alert("Preencha corretamente os dados");
}

var idAberto = "";

function abreQuiz(elem){

    idAberto = elem.getAttribute("id")    

    var abreQuiz = axios.get(urlGetQuiz, {headers : {"User-token" : token}});
    abreQuiz.then(renderQuizSelecionado);
}

let dataQuiz = {};

function renderQuizSelecionado(info){

    var dados = info.data;
    
    for(var i = 0; i < dados.length; i++){

        if(dados[i].id == idAberto){            
            dataQuiz = dados[i];
            mudandoParaSelecionado()           
            renderQuiz()
        }
    }
}

function mudandoParaSelecionado(){

    var menuQuizzes = document.querySelector(".menu-quizzes");
    var inicio = document.querySelector("body > header");
    var quiz = document.querySelector(".pagina-quiz")

    inicio.style.display = "none"

    menuQuizzes.classList.remove("fade-in");
    menuQuizzes.classList.add("fade-out");

    quiz.style.display = "flex"
    quiz.classList.add("fade-in");

}

var questAtual = 0

function renderQuiz(){

    questAtual = 0;

    let pergunta = dataQuiz.data.pergunta;

    let paginaQuiz = document.querySelector(".pagina-quiz");

    let h2 = document.createElement("h2");
    h2.innerText = dataQuiz.title
    paginaQuiz.appendChild(h2);

    let boxPergunta = document.createElement("div");
    boxPergunta.classList.add("box-perguntas");
    paginaQuiz.appendChild(boxPergunta)    

    let div = document.createElement("div");
    div.classList.add("pergunta-exibida");
    div.innerHTML = `<h1><strong>${pergunta[questAtual].tituloPergunta}</strong></h1>`;
    div.innerHTML += `<div class="box-respostas">
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[0].flag}" ><img src="${pergunta[questAtual].Respostas[0].linkResposta}"><footer>${pergunta[questAtual].Respostas[0].resposta}</footer></div>
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[1].flag}"><img src="${pergunta[questAtual].Respostas[1].linkResposta}"><footer>${pergunta[questAtual].Respostas[1].resposta}</footer></div>
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[2].flag}"><img src="${pergunta[questAtual].Respostas[2].linkResposta}"><footer>${pergunta[questAtual].Respostas[2].resposta}</footer></div>
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[3].flag}"><img src="${pergunta[questAtual].Respostas[3].linkResposta}"><footer>${pergunta[questAtual].Respostas[3].resposta}</footer></div>
    </div>`
    boxPergunta.appendChild(div)    
}

var countResposta = 0

function respostaSelecionada(elem){

    let qtdPergunta = dataQuiz.data.pergunta.length;

    let selecionado = elem.getAttribute("flag");
    let corResposta = elem.querySelector("footer");
    let divResposta = document.querySelectorAll(".box-respostas > div");
    

    if(selecionado == "true"){ 
        countResposta++;
        corResposta.style.backgroundColor = "lightgreen";
        for(var i = 0; i < divResposta.length; i++){
            divResposta[i].removeAttribute("onclick");
        }
    } else {
        corResposta.style.backgroundColor = "#dd90a9"
        for(var i = 0; i < divResposta.length; i++){
            divResposta[i].removeAttribute("onclick");
        }
    }
    
    if((qtdPergunta - 1) > questAtual){
        questAtual++
        setTimeout(renderProximaPergunta, 2000)
    } else { 
        setTimeout(mudandoParaResultado, 2000)
    }    
}

function renderProximaPergunta(){
    
    let pergunta = dataQuiz.data.pergunta;           
    
    let boxPergunta = document.querySelector(".box-perguntas");
    boxPergunta.innerHTML = ""

    let div = document.createElement("div");
    div.classList.add("pergunta-exibida");
    div.innerHTML = `<h1><strong>${pergunta[questAtual].tituloPergunta}</strong></h1>`;
    div.innerHTML += `<div class="box-respostas">
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[0].flag}" ><img src="${pergunta[questAtual].Respostas[0].linkResposta}"><footer>${pergunta[questAtual].Respostas[0].resposta}</footer></div>
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[1].flag}"><img src="${pergunta[questAtual].Respostas[1].linkResposta}"><footer>${pergunta[questAtual].Respostas[1].resposta}</footer></div>
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[2].flag}"><img src="${pergunta[questAtual].Respostas[2].linkResposta}"><footer>${pergunta[questAtual].Respostas[2].resposta}</footer></div>
    <div onclick = "respostaSelecionada(this)" flag = "${pergunta[questAtual].Respostas[3].flag}"><img src="${pergunta[questAtual].Respostas[3].linkResposta}"><footer>${pergunta[questAtual].Respostas[3].resposta}</footer></div>
    </div>`
    boxPergunta.appendChild(div)        
    
}

function mudandoParaResultado(){

    let quiz = document.querySelector(".pagina-quiz");
    let resultado = document.querySelector(".tela-resultado");

    quiz.classList.remove("fade-in");
    quiz.classList.add("fade-out");
    quiz.style.display = "none"

    resultado.classList.add("fade-in");
    resultado.style.display = "flex"

    renderResultado()
    

}


function renderResultado(){
    
    let qtdPergunta = dataQuiz.data.pergunta.length;
    let dadosNivel = dataQuiz.data.nivel;
    var taxaAcerto = Math.floor((countResposta / qtdPergunta) * 100);
    let containerResultado = document.querySelector(".tela-resultado");

    for(var i = 0; i < dadosNivel.length; i++){

        var min = dadosNivel[i].rangeMin;
        var max =  dadosNivel[i].rangeMax;

        if((taxaAcerto >= min) && (taxaAcerto <= max)){

            let h2 = document.createElement("h2")
            h2.innerText = dataQuiz.title;
            containerResultado.appendChild(h2);

            let div = document.createElement("div");
            div.classList.add("resultado");
            div.innerHTML = `<p>Voce acertou ${countResposta} de ${qtdPergunta} pergunta(s)</p>`;
            div.innerHTML += `Score: ${taxaAcerto}%`;
            containerResultado.appendChild(div);

            let art = document.createElement("article");
            art.innerHTML = `<div class="descricao">
                                    <strong>${dadosNivel[i].tituloNivel}</strong>
                                    <p>${dadosNivel[i].desc}</p>
                                </div>
                                <div class="imagem"><img src="${dadosNivel[i].linkNivel}"></div>`
            containerResultado.appendChild(art);

            return;
        }
    }
}

function retorna(){
    window.location.reload();
}