<div align="center">

<a href="https://github.com/Arcani97/property-inspector"><img src="https://img.shields.io/badge/Home-242526?logo=googlehome" alt="home"></a>
<a href="https://github.com/Arcani97/property-inspector/blob/main/README-en.md"><img src="https://img.shields.io/badge/README-EN-00247d?style=flat&labelColor=242526" alt="en"></a>
<a href="https://github.com/Arcani97/property-inspector/blob/main/README-ptbr.md"><img src="https://img.shields.io/badge/README-PT--BR-004f1e?style=flat&labelColor=7c7e7e" alt="ptbr"></a>

<h1>Inspetor de Caminho de Propriedade</h1>

</div>

<br>

<h2>Como usar</h2>

<ol>
  <li>Ative o atalho do inspetor (padrão <kbd>Alt</kbd> + <kbd>P</kbd>, personalizável em <strong>Configurar Controles</strong> do Foundry).</li>
  <li>Passe o mouse sobre qualquer campo de uma ficha de Item ou Actor aberta — campos de formulário, descrições em texto rico, qualquer coisa renderizada a partir dos dados de <code>system</code>.</li>
  <li>Um tooltip aparece ao lado do cursor mostrando o caminho de dados do campo (ex: <code>system.description.value</code>).</li>
  <li>Clique no campo para copiar o caminho exibido no momento para a área de transferência.</li>
  <li>Pressione o atalho novamente para desativar.</li>
</ol>

<br>

<h2>Compatibilidade com sistemas de jogo</h2>

<p>O módulo é agnóstico de sistema: ele não depende de nenhuma configuração específica de sistema para funcionar, diferente de módulos que precisam de um campo mapeado por sistema. Ele lê o atributo <code>name</code> ou <code>data-edit</code> que o próprio Foundry coloca em cada campo, então qualquer sistema construído da forma padrão já é suportado.</p>

<p>Ele reconhece tanto fichas <strong>ApplicationV2</strong> (<code>.application</code>) quanto fichas legadas <strong>Application (V1)</strong> (<code>.window-app</code>), funcionando independentemente de o sistema já ter migrado suas fichas para a nova API.</p>

<p>Para elementos que não expõem um name (texto simples somente leitura, por exemplo), o módulo recorre a uma busca por correspondência entre o texto visível e os dados brutos de <code>system</code> do item. Esse fallback é uma tentativa best-effort: pode falhar se dois campos tiverem o mesmo valor, ou se o texto exibido for diferente do valor bruto armazenado.</p>

<br>

<h2>Atalho Padrão</h2>

<p><kbd>Alt</kbd> + <kbd>P</kbd>. Totalmente personalizável no menu <strong>Configurar Controles</strong> do Foundry, em <strong>Property Path Inspector</strong>.</p>

<br>

<h2>Adicionar um novo idioma</h2>

<p>Isso foi pensado para ser bem simples:</p>

<ol>
  <li>Copie <code>lang/en.json</code> (ou <code>lang/pt-BR.json</code>) para um novo arquivo, ex: <code>lang/es.json</code>.</li>
  <li>Traduza os valores (a parte à direita de cada <code>:</code>). <strong>Não altere as chaves</strong> à esquerda (ex: <code>"PROPERTYINSPECTOR.Notif.Activated"</code>) — só o texto traduzido.</li>
  <li>Abra o <code>module.json</code> e adicione uma entrada em <code>"languages"</code>:</li>
</ol>

<pre><code>{ "lang": "es", "name": "Español", "path": "lang/es.json" }</code></pre>

<ol start="4">
  <li>Reinicie o Foundry por completo (não basta um refresh na página ou relançar o mundo) — alterações de manifesto só são lidas na inicialização. O novo idioma aparecerá nas opções de idioma do Foundry.</li>
</ol>

<p>Nenhum outro arquivo precisa ser tocado para traduzir o módulo — todo o texto de interface vem dos arquivos em <code>lang/</code>.</p>

<br>

<h2>Estrutura do módulo</h2>

<pre><code>property-inspector/
├── module.json                     Manifesto do módulo
├── scripts/
│   └── property-inspector.js       Atalho, detecção de hover, resolução de caminho, tooltip, clipboard
├── styles/
│   └── property-inspector.css      Estilos do tooltip e do highlight
└── lang/
    ├── en.json                     Inglês
    └── pt-BR.json                  Português
</code></pre>

<br>

<h2>Notas técnicas</h2>

<ul>
  <li>O inspetor nunca escreve em nenhum Document — é um overlay puramente de leitura, nenhuma world setting ou armazenamento de dados é usado.</li>
  <li>Caminhos exatos vêm diretamente do atributo <code>name</code> (campos de formulário) ou <code>data-edit</code> (conteúdo de texto rico/prose-mirror em modo de exibição).</li>
  <li>O caminho aproximado do fallback é encontrado por uma busca recursiva em <code>item.system</code> (ou <code>actor.system</code>), comparando cada valor folha com o texto do elemento sob o cursor.</li>
  <li>O tooltip é um elemento de posição fixa com <code>z-index</code> bem alto; como o tooltip nativo do navegador (<code>title</code>) e o sistema de tooltip próprio do Foundry (<code>data-tooltip</code>) sempre renderizam por cima de qualquer conteúdo da página independente do <code>z-index</code>, o módulo remove temporariamente o atributo presente no elemento sob o cursor (devolvendo depois) para que nenhum dos dois sobreponha o tooltip do módulo.</li>
  <li>Um clique com o inspetor ativo copia o último caminho mostrado pelo tooltip — não faz uma nova busca pela posição do clique — já que o tooltip fica deslocado do cursor.</li>
</ul>
