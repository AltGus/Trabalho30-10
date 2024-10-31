const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Serve a pasta public onde está o styles.css
app.use(express.static('public'));

// Configurando o uso da biblioteca do cookie
app.use(cookieParser());

// Configurando o uso do body-parser para pegar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando a sessão
app.use(session({
    secret: 'LIGHT BEAM', // chave secreta para os cookies
    resave: false, // evita regravar as sessões que não se alteram
    saveUninitialized: true, // e sessões anônimas
}));

// Dados de exemplo (usuários)
const usuarios = [
    { id: 1, username: 'user1', password: 'senha1' },
    { id: 2, username: 'user2', password: 'senha2' }
];

// Rota de login
app.get('/login', (req, res) => {
    res.send(`
        <link rel="stylesheet" type="text/css" href="/styles.css">
        <h1>Login</h1>
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Usuário" required>
            <input type="password" name="password" placeholder="Senha" required>
            <button type="submit">Entrar</button>
        </form>
    `);
});

// Lógica para autenticar o usuário
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usuario = usuarios.find(u => u.username === username && u.password === password);

    if (usuario) {
        req.session.usuarioId = usuario.id; // Guarda o id do usuário na sessão
        return res.redirect('/protegida');
    }

    res.send('Usuário ou senha inválidos. <a href="/login">Tente novamente</a>');
});

// Middleware de autenticação
function autenticar(req, res, next) {
    if (req.session.usuarioId) {
        return next(); // Usuário autenticado, continue
    }
    res.redirect('/login'); // Redireciona para login se não autenticado
}

// Rota protegida
app.get('/protegida', autenticar, (req, res) => {
    res.send(`
        <link rel="stylesheet" type="text/css" href="/styles.css">
        <h1>Página Protegida</h1>
        <p>Bem-vindo, usuário ${req.session.usuarioId}!</p>
        <a href="/logout">Sair</a>
    `);
});

// Rota de produtos
app.get('/produtos', (req, res) => {
    res.send(`
        <link rel="stylesheet" type="text/css" href="/styles.css">
        <h1>Lista De Produto</h1>
        <ul>
            <li>Produto_1 - 10 <a href="#">Adicionar</a></li>
            <li>Produto_2 - 15 <a href="#">Adicionar</a></li>
            <li>Produto_3 - 20 <a href="#">Adicionar</a></li>
        </ul>
        <a href="/carrinho">Ver Carrinho</a>
    `);
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
