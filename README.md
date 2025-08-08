# 🧾 Cadastro de Fornecedor/Produto

Projeto desenvolvido como parte de um desafio de Front-End da [Vflows](https://github.com/VFLOWS/Teste-Estagio), utilizando tecnologias básicas da web, com foco em organização de código, usabilidade e boas práticas para iniciantes.


---

## ✨ Funcionalidades

- Formulário completo para cadastro de fornecedores e produtos.
- Consumo de API ViaCEP para preenchimento automático do endereço.
- Inclusão dinâmica de múltiplos produtos e anexos.
- Geração de JSON final com todos os dados do formulário.
- Feedbacks visuais e alertas para validações de campos obrigatórios.
- Visualização e download de anexos diretamente no navegador (via `FileReader` e `sessionStorage`).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript ES6**
- **Bootstrap 4.5.2**
- **jQuery 3.5.1**
- **Fluig Style Guide**
- **API ViaCEP**

---

## 📦 Estrutura do Projeto

```
/
├── index.html             # Estrutura HTML principal
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   └── script.js          # Funcionalidades interativas
├── README.md              # Documentação do projeto
```

---

## 🖼️ Interface do Projeto

### 📍 Formulário do Fornecedor

- Campos como razão social, CNPJ, endereço, contato, etc.
- Validação de campos obrigatórios.

### 📦 Produtos

- Adição dinâmica de produtos.
- Cálculo automático do valor total (quantidade × valor unitário).
- Botão de exclusão com controle de no mínimo 1 produto.

### 📁 Anexos

- Inclusão dinâmica de arquivos.
- Visualização via `FileReader` e `sessionStorage`.
- Botão de download/visualização do anexo.
- Validação de no mínimo 1 anexo.

---

## 🔧 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/mariana-cristina-dias/desafio-frontend-vflows
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd desafio-frontend-vflows
   ```

3. Abra o arquivo `index.html` no navegador.

---

## ✅ Requisitos Atendidos

- [x] Campos obrigatórios validados
- [x] Inclusão dinâmica de produtos e anexos
- [x] Consumo da API de CEP (ViaCEP)
- [x] Visualização de anexos com FileReader e `sessionStorage`
- [x] Geração de JSON final com todos os dados do formulário
- [x] Interface com design responsivo utilizando Bootstrap + Fluig Style Guide

---

## 👩🏽‍💻 Desenvolvedora

**Mariana Cristina Dias dos Santos**
 
- 💼 [LinkedIn](https://www.linkedin.com/in/mariana-cristina-dias/)  

---

## 📃 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração de habilidades. Licença livre.
