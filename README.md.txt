Projeto de Cadastro e consulta da Igreja - React Native

- Módulos:
	TabBar: Módulo que cria uma TabBar que pode chamar uma quantidade ilimitada de telas, conforme a necessidade.
		Parâmetros: 
			name: nome do botão que irá compor a TabBar;
			route: pra qual tela este botão irá direcionar;
			icon: icone do botão;
			iconOnFocus (opcional): altera o icone quando o botão está focado;
			theme (Valor Fixo de {(({color,subColor,barComponent,badge,badgeItem}) => ({color,subColor,barComponent,badge,badgeItem}))(Theme)})
				altera componentes dependendo se o tema é diurno ou noturno;
			addBadge (boolean): se a TabBar possue um fab button;
			filter: parametro para colocar o filtro de pesquisa nas telas

	Header: Módulo que cria um cabeçalho para uma página.
		Parâmetros:
			title: titulo que estará presente no cabeçalho;
			myLeftContainer: container de elementos a que estarão do lado esquerdo do Header;
			myRightContainer: container de elementos que estarão do lado esquerdo do Header;
			complement: complemento se quiser adcionar mais algo do lado direito do Header, porém
			que não estaja relacionado com os elementos do "MyRightContainer;

	Card: Módulo que cria os Cards para os louvores.
	      Parâmetros:
			content: Irá conter as apis, com os itens que serão apresentadas nos cards 

- Módulos de Estilo:
     Styles.js: módulo de Styled Components, que irá alterar o tema dos objetos interligados com ele, utilizando como
		base os temas dark e light que estão no módulo Themes.js

	OBS: a TabBar é o unico que não utiliza o Styled.js, mas consome das informações do Theme.js por herança
	     theme (Valor Fixo de {(({color,subColor,barComponent,badge,badgeItem}) => ({color,subColor,barComponent,badge,badgeItem}))(Theme)})

- Telas:
	Home.js: Home do aplicativo, onde será chamada a maioria das ações principais citadas acima

- App.js:
	Responsável por inicializer o aplicativo, e onde está o useColorScheme que irá determinar qual tema est´s sendo utilizado
       pelo aplicativo.	
			
		
"			