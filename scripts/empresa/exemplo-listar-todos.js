let tabelaEmpresas = document.getElementById('tabela-empresas');


let botaoConsultarEmpresas = document.getElementById("consultar-empresas");

let urlAPI = "https://public.franciscosensaulas.com"

function atribuirCliqueBotoesApagar(){
    
    // pegar a lista de elementos que contém a class="botao-apagar"
    let botoesApagar = document.getElementsByClassName("botao-apagar");
    // foreach percorre cada um dos elementos da lista
    Array.from(botoesApagar).forEach((botao) => {
        // cada um dos botões atribuiremos o evento de click que executará a função apagar
        botao.addEventListener('click', apagar);
    });
}

    // Função responsável por questionar o usuário se o mesmo deseja realmente apagar aquele registro
function apagar(evento) {
    // evento é uma variavel que fica dispnivel quando ocorre o clique do botão, poderia ser qualquer nome no lugar de evento
    // utilizaremos o evento para saber qual o botão que occoreu o clique

    // obter o botão que ocorreu o click do evento
    const botaoClique = evento.target;
    // data - são atributos(variaveis) colocadas noHTML, para podemos ter acesso no javascript
    // neste cenãrio colocamos data-id e data-nome, para podemrmos apresentar para o usuário o que ele estã apagando
    //o id foi colocado para sabermos qual empresa deveremos apagar

    // obter o nome do atributo (data-nome) do botão de apagar
    const nome = botaoClique.getAttribute("data-nome");
    const id = botaoClique.getAttribute("data-id");

    Swal.fire({
        title: `Deseja apagar o cadastro da empresa '${nome}'?`,
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim apagar!",
        cancelButtonText: "Não",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
             apagarEmpresa(id);
        }
    });
    consultarEmpresa();
}

async function apagarEmpresa(id){
    let url = `${urlAPI}/api/v1/empresa/${id}`
    console.log(url)

    const resposta = await fetch(url,{method: "DELETE"});
    if(resposta.ok == false)
        alert("Não foi possivel apagar");
        return;

    Swal.fire({
        title: "Apagado!",
        text: "Empresa removida com sucesso!",
        icon: "success"
    });
}

// funcao responsavel por fazer o request(requisição) para carregar os dados da empresa

async function consultarEmpresa() {
    //debugger;
    // let url - urkAPI + "/api/v1/empresa"
    let url = `${urlAPI}/api/v1/empresa`
    // fetch vai realizar a requisição, na variável resposta teremos os dados do response como: status, response em si (dados que o bacl-end retornou)
    const resposta = await fetch(url)
    // Verificar se a requisição falou por algum motivo
    if (resposta.ok == false) {
        alert("Não foi possivel carregar os dados")
    }


    // obter o response da requisição, que neste cenário seria uma lista de objetos
    const empresas = await resposta.json();

    let tbody = tabelaEmpresas.querySelector("tbody");
    tbody.innerHTML = "";

    empresas.forEach(empresa =>{  
    
         const colunas = `
         <td>${empresa.id}</td>
         <td>${empresa.nome}</td>
         <td>${empresa.cnpj}</td>
         <td>
         <a href="editar.html?id=${empresa.id}" class="btn btn-warning"><i class="fas fa-pencil"></i> Editar</a>
         <button class="btn btn-danger botao-apagar" data-id=${empresa.id} data-nome=${empresa.nome}><i class="fas fa-trash"></i> Apagar</button>
         </td>`
         const linha = document.createElement("tr");
         linha.innerHTML = colunas;
         
        
         tbody.appendChild(linha);
         
         console.log(empresa)
        });
        
        atribuirCliqueBotoesApagar()
}



botaoConsultarEmpresas.addEventListener("click", consultarEmpresa);

//carregar  os registros na tabela
consultarEmpresa();