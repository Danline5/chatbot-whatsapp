const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client();

const lastMenu = {};
const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('qr', qr => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
    console.log(`📲 Escaneie o QR Code para autenticar:\n${qrLink}`);
});

client.on('ready', () => {
    console.log('✅ Tudo certo! WhatsApp conectado.');
});

client.initialize();

client.on('message', async msg => {
    const body = msg.body.trim().toLowerCase();
    const sender = msg.from;

    // MENU PRINCIPAL
    if (body.match(/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite)$/i) && sender.endsWith('@c.us')) {
        lastMenu[sender] = null;
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(sender,
            `Olá, ${name.split(" ")[0]}! 👋\n\nBem-vindo à central oficial da *R5 Shows e Eventos*!\n\nEscolha uma das opções para continuar:\n\n1️⃣ Conecta Brazil Experience\n2️⃣ Show Dino Fonseca`);
        return;
    }

    // 2 - Show Dino Fonseca
    if (body === '2' && (!lastMenu[sender] || lastMenu[sender] !== 'conecta')) {
        lastMenu[sender] = 'dino';
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(sender,
            `🎤 *ATENÇÃO: Show Dino Fonseca*\n\nInformamos que, por motivos de força maior, o show *Back to the 80’s* com Dino Fonseca foi *adiado*.\n\nEm breve, uma nova data será divulgada oficialmente.\n\nAgradecemos pela compreensão.\n\nSe desejar atendimento, digite:\n1️⃣ Falar com atendente\n\n🔙 Digite *menu* para voltar ao início`);
        return;
    }

    // Atendimento para Dino Fonseca
    if (lastMenu[sender] === 'dino' && body === '1') {
        await client.sendMessage(sender,
            `👤 Olá! Eu sou *Larissa*, da equipe R5 Shows.\n\nLogo mais estarei respondendo sua dúvida.\nVocê já pode me enviar sua mensagem por aqui! 💬`);
        return;
    }

    // 1 - Conecta Brazil
    if (body === '1' && lastMenu[sender] !== 'conecta') {
        lastMenu[sender] = 'conecta';
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(sender,
            `🌎 *CONECTA BRAZIL – EXPERIENCE*\nBrasil em perspectiva, desafios e recomeços.\n\nPrepare-se para uma jornada transformadora com lideranças visionárias e grandes nomes confirmados.\n\n📅 *25 de Julho de 2025*\n📍 *Centro de Eventos Plínio Arlindo de Nes*\n🎟️ Ingressos limitados, assentos por ordem de chegada.\n\nEscolha uma opção abaixo:\n1️⃣ Ver todos os palestrantes\n2️⃣ Ver setores e valores\n3️⃣ Link para compra de ingressos\n4️⃣ Falar com atendente\n\n🔙 Digite *menu* para voltar ao início`);
        return;
    }

    // Subopções do menu Conecta
    if (lastMenu[sender] === 'conecta') {
        if (body === '1') {
            await client.sendMessage(sender,
                `🔒 *PALESTRANTES CONFIRMADOS*\n\n1. *Nikolas Ferreira* - Liderança e influência no Congresso.\n2. *Palestrante 2* - Comunicação e pensamento crítico.\n3. *Palestrante 3* - Networking e bastidores estratégicos.\n4. *Palestrante 4* - Engajamento e alta performance.\n5. *Palestrante 5* - Liderança feminina e coragem intelectual.\n\n🔙 Digite *menu* para voltar ao início`);
            return;
        }

        if (body === '2') {
            const imagem = MessageMedia.fromFilePath('./imagens/setores-conecta.jpg');
            await client.sendMessage(sender, imagem, {
                caption: `🗺️ *Mapa dos setores do Conecta Brazil – Experience*\n\nConfira a imagem com a divisão dos setores: Diamante, Ouro, Prata e Bronze.`
            });

            await client.sendMessage(sender,
                `🎟️ *VALORES CONECTA BRAZIL EXPERIENCE*\n\n💎 *Setor Diamante:* R$ 490 (+R$49 taxa)\n🥇 *Setor Ouro:* R$ 390 (+R$39 taxa)\n🥈 *Setor Prata:* R$ 290 (+R$29 taxa)\n🥉 *Setor Bronze:* R$ 190 (+R$19 taxa)\n\n🎫 *Meia Entrada:*\n💎 Diamante: R$ 245 (+R$24,50)\n🥇 Ouro: R$ 195 (+R$19,50)\n🥈 Prata: R$ 145 (+R$14,50)\n🥉 Bronze: R$ 95 (+R$9,50)\n\nTodos os assentos são por ordem de chegada.\n\n🔙 Digite *menu* para voltar ao início`);
            return;
        }

        if (body === '3') {
            await client.sendMessage(sender,
                `🛒 *Garanta seu ingresso agora mesmo:*\nhttps://r5showseeventos.pagtickets.com.br/conecta-brazil-experience__16398/\n\n🔙 Digite *menu* para voltar ao início`);
            return;
        }

        if (body === '4') {
            await client.sendMessage(sender,
                `👤 Olá! Eu sou *Larissa*, da equipe R5 Shows.\n\nLogo mais estarei respondendo sua dúvida.\nVocê já pode me enviar sua mensagem por aqui! 💬`);
            return;
        }
    }
});
