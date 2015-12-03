/*
 * PREDICADOS DE VISUALIZAÇÃO DO TABULEIRO
 *
 * 0 representa um triângulo voltado para cima como espaço branco (para evitar desformatação)
 * 1 representa um triângulo voltado para cima como espaço branco (para evitar desformatação)
 * 2 representa um triângulo voltado para cima jogado pelo jogador humano (jogador 1)
 * 3 representa um triângulo voltado para baixo jogado pelo jogador humano (jogador 1)
 * 4 representa um triângulo voltado para cima jogado pelo PC (jogador 2)
 * 5 representa um triângulo voltado para baixo jogado pelo PC (jogador 2)
*/
  
  
  
/*
 * O predicado twrite_first(X) escreve diretamente para a consola a primeira de quatro partes de um triângulo, correspondendo X a um inteiro que define o tipo de triângulo a ser desenhado
*/

twrite_first(0):- write('  ').
twrite_first(1):- write('        ').
twrite_first(2):- write(/), write(\).
twrite_first(3):- write(\), put_code(175), put_code(175), put_code(175), put_code(175), put_code(175), put_code(175), write(/).
twrite_first(4):- write(/), write(\).
twrite_first(5):- write(\), put_code(175), put_code(175), put_code(175), put_code(175), put_code(175), put_code(175), write(/).

/*
 * O predicado twrite_sec(X) escreve diretamente para a consola a segunda de quatro partes de um triângulo, correspondendo X a um inteiro que define o tipo de triângulo a ser desenhado
*/

twrite_sec(0):- write('    ').
twrite_sec(1):- write('      ').
twrite_sec(2):- write(/), write('  '), write(\).
twrite_sec(3):- write(\), write('  1 '), write(/).
twrite_sec(4):- write(/), write('++'), write(\).
twrite_sec(5):- write(\), write('++2+'), write(/).

/*
 * O predicado twrite_third(X) escreve diretamente para a consola a terceira de quatro partes de um triângulo, correspondendo X a um inteiro que define o tipo de triângulo a ser desenhado
*/

twrite_third(0):- write('      ').
twrite_third(1):- write('    ').
twrite_third(2):- write(/), write('  1 '), write(\).
twrite_third(3):- write(\), write('  '), write(/).
twrite_third(4):- write(/), write('++2+'), write(\).
twrite_third(5):- write(\), write('++'), write(/).

/*
 * O predicado twrite_last(X) escreve diretamente para a consola a quarta de quatro partes de um triângulo, correspondendo X a um inteiro que define o tipo de triângulo a ser desenhado
*/

twrite_last(0):- write('        ').
twrite_last(1):- write('  ').
twrite_last(2):- write(/), write('______'), write(\).
twrite_last(3):- write(\), write(/).
twrite_last(4):- write(/), write('______'), write(\).
twrite_last(5):- write(\), write(/).

/*
 * O predicado print_line_first imprime a linha do topo para todos os triângulos de uma lista (sendo cada triângulo composto por quatro partes na consola, correspondendo esta à primeira parte)
*/

print_line_first([]).
print_line_first([H|T]):-
	twrite_first(H),
	print_line_first(T).

/*
 * O predicado print_line_sec imprime a primeira linha do meio para todos os triângulos de uma lista (sendo cada triângulo composto por quatro partes na consola, correspondendo esta à segunda parte)
*/
	
print_line_sec([]).
print_line_sec([H|T]):-
	twrite_sec(H),
	print_line_sec(T).

/*
 * O predicado print_line_third imprime a segunda linha do meio para todos os triângulos de uma lista (sendo cada triângulo composto por quatro partes na consola, correspondendo esta à terceira parte)
*/
	
print_line_third([]).
print_line_third([H|T]):-
	twrite_third(H),
	print_line_third(T).

/*
 * O predicado print_line_last imprime a linha final para todos os triângulos de uma lista (sendo cada triângulo composto por quatro partes na consola, correspondendo esta à quarta parte)
*/
	
print_line_last([]).
print_line_last([H|T]):-
	twrite_last(H),
	print_line_last(T).

/*
 * printB_norm é um predicado utilizado para imprimir linhas que comecem com um triângulo com um dos vértices a apontar para cima
*/	

printB_norm([]).
printB_norm([H|T]):-
	write('      '), print_line_first(H), nl,
	write('     '), print_line_sec(H), nl,
	write('    '), print_line_third(H), nl,
	write('   '), print_line_last(H), nl,
	printB_norm(T).

/*
 * printB_inv é um predicado utilizado para imprimir linhas que comecem com um triângulo invertido (com um dos vértices a apontar para baixo)
*/	

printB_inv([]).
printB_inv([H|T]):-
	write('   '), print_line_first(H), nl,
	write('    '), print_line_sec(H), nl,
	write('     '), print_line_third(H), nl,
	write('      '), print_line_last(H), nl,
	printB_inv(T).
	
/*
 * printB é um predicado utilizado para imprimir o tabuleiro do jogo
*/ 
	
printB([]).
printB([[0|R]|T]):- printB_norm([[0|R]]),
					printB(T).
printB([[1|R]|T]):- printB_inv([[1|R]]),
					printB(T).
printB([[2|R]|T]):- printB_norm([[2|R]]),
					printB(T).
printB([[3|R]|T]):- printB_inv([[3|R]]),
					printB(T).
printB([[4|R]|T]):- printB_norm([[4|R]]),
					printB(T).
printB([[5|R]|T]):- printB_inv([[5|R]]),
					printB(T).

/*
 *  
 *
 * LÓGICA DO JOGO
 *
 *
*/ 
					
/*
 * PREDICADOS UTILITÁRIOS DA LÓGICA DO JOGO
 *
*/

/*
 * O predicado get_el recebe uma lista e o índice do elemento na lista o que permite ir buscar um elemento específico a uma lista guardado na variável E.
*/

get_el([H|_], 1, E):-	E = H.
get_el([_|T], C, E):-	C1 is C-1,
						get_el(T, C1, E).

/*
 * O predicado list_length recebe uma lista e uma variável vazia onde o tamanho da lista será calculado e guardado na variável vazia. 
*/

list_length(Xs, L):- list_length(Xs,0,L).
list_length([], L, L).
list_length([_|T], C, L):- 	C1 is C+1,
							list_length(T,C1,L).			


/*
 * Os predicados get_ell e get_ellc recebem uma lista de listas, uma linha R e uma coluna C e 
 * permitem ir buscar um elemento específico a uma lista de listas (guardado na variável E). Se o elemento procurado na lista de listas estiver out of bounds, é guardado o valor -1 em E.
 *
*/ 

get_ellc([], C, E):-	C >= 1,
						!,
						E = -1.
get_ellc(_, C, E):- 	C =< 0,
						!,
						E = -1.		
get_ellc([H|_], C, E):-	C == 1,
						!,
						E = H.							
get_ellc([_|T], C, E):- C1 is C-1,
						get_ellc(T, C1, E).

get_ell([], _, R, E):-	R > 0,
						!,
						E = -1.						
get_ell(_, _, R, E):-	R =< 0,
						!,
						E = -1.
get_ell([H|_], C, R, E):-	R == 1,
							!,
							get_ellc(H, C, E).
get_ell([_|T], C, R, E):- R1 is R-1,
							get_ell(T, C, R1, E).
							
/*
 * O predicado verif_play recebe uma lista de listas e uma lista com dois elementos. O predicado 
 * permite verificar se a jogada que o jogador 1 está a tentar fazer faz parte da lista de jogadas disponíveis.
*/
							
verif_play([H|_], Play):-	H == Play.
verif_play([_|T], Play):-	verif_play(T, Play).			

/*
 * O predicado replace recebe uma lista de listas, a linha X e a coluna Y onde o elemento vai ser substituído por Z, assim como a lista final. O predicado 
 * substitui um elemento numa lista de listas por outro elemento.
 *
*/
	
replace([L|Ls], 1, Y, Z, [R|Ls]):-	replace_column(L, Y, Z, R).
replace([L|Ls], X, Y, Z, [L|Rs]):-	X > 1,
									X1 is X-1,
									replace(Ls, X1, Y, Z, Rs).
replace_column([_|Cs], 1, Z, [Z|Cs]).
replace_column([C|Cs], Y, Z, [C|Rs]):- 	Y > 1,                                   
										Y1 is Y-1,
										replace_column(Cs , Y1, Z, Rs).

/*
 * Os predicados memberf e set permitem remover elementos duplicados numa lista (utilizado para remover jogadas repetidas da lista de jogadas disponíveis).
*/
											
memberf(X,[X|_]):- !.
memberf(X,[_|T]):- memberf(X,T).

set([],[]).
set([H|T],[H|Out]):-	\+ (memberf(H,T)),
						!,
						set(T,Out).
set([H|T],Out):-	memberf(H,T),
					set(T,Out).	

/*
 * O predicado max determina o maior elemento de uma lista e devolve o índice desse elemento.
*/ 
max([], _, ITF, ITF, _).
max([H|T], IT, _, IF, B):- 	H > B,
							B1 is H,
							IT1 is IT+1,
							max(T, IT1, IT, IF, B1).
max([_|T], IT, ITF, IF, B):- IT1 is IT+1,
							max(T, IT1, ITF, IF, B).
							

										
/*
 *  FIM DOS PREDICADOS UTILITÁRIOS DA LÓGICA DO JOGO
 *
*/

/*
 * PREDICADOS DA LÓGICA DO JOGO 
 *
*/

/*
 * main é um predicado utilizado para iniciar o jogo.
*/  
	
main:-	initBoard.

/*
 * initBoard é um predicado utilizado para definir os diferentes modos de jogo
 *
*/
					
initBoard:-	write('Select mode (pp for Player-Player game, ppc for Player-PC game and pcpc for PC-PC game)'),			
			nl,
			read(A),
			initBoard(A).
initBoard(pp):-	B = [[2]],
				printB(B),
				initBPP1(B).			
initBoard(ppc):- 	write('PC difficulty? (0 for medium difficulty, 1 for hard'),
					read(D),
					B = [[2]],
					initBP1(B, D).
initBoard(pcpc):-	write('PC difficulty? (0 for medium difficulty, 1 for hard'),
					read(D),
					B = [[2]],
					initBPPC(B, D).

initBPP1(B):- 	T1 = 25,
				T2 = 25,
				make_play(B, p2, T1, T2).
initBP1(B, D):- T1 = 25,
				T2 = 25,
				make_play(B, pc, T1, T2, D).	 
initBPPC(B, D):-	T1 = 25,
					T2 = 25,
					make_play(B, ppc2, T1, T2, D).
	
/*
 * make_play é um predicado que recebe o tabuleiro, o jogador activo (jogador 1 ou PC) assim como o número de peças de cada jogador e realiza a jogada no tabuleiro.
*/

/*
 * make_play para um PC a jogar como jogador 1 num jogo entre PCs
*/

make_play([H|T], ppc, T1, T2, D):-	D == 0, /** D define a dificuldade em que se encontram os dois PCs */
									!,
									list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									find_bestplay([H|T], ppc, PLA, BPL, [], 0),
									list_length(BPL, L3),
									L3H is L3//2,
									get_el(PLA, L3H, [R|[CH|_]]),
									make_playaux([H|T], p1, R, CH, NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),
									verif_solution(NB, ppc, pc, NB, 1, 1, L2, T1, T2, D).
make_play([H|T], ppc, T1, T2, D):-	D == 1,
									!,
									list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									find_bestplay([H|T], ppc, PLA, BPL, [], 0),
									max(BPL, 1, 1, IF, 0),
									get_el(PLA, IF, [R|[CH|_]]),
									make_playaux([H|T], p1, R, CH, NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),									
									verif_solution(NB, ppc, pc, NB, 1, 1, L2, T1, T2, D).

/*
 * make_play para um PC a jogar como PC num jogo entre PCs
*/
									
make_play([H|T], ppc2, T1, T2, D):-	D == 0,
									!,
									list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									find_bestplay([H|T], pc, PLA, BPL, [], 0),
									list_length(BPL, L3),
									L3H is L3//2,
									get_el(PLA, L3H, [R|[CH|_]]),
									make_playaux([H|T], pc, R, CH, NB),
									printB(NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),
									verif_solution(NB, pc, ppc, NB, 1, 1, L2, T1, T2, D).
make_play([H|T], ppc2, T1, T2, D):-	D == 1,
									!,
									list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									find_bestplay([H|T], pc, PLA, BPL, [], 0),
									max(BPL, 1, 1, IF, 0),
									get_el(PLA, IF, [R|[CH|_]]),
									make_playaux([H|T], pc, R, CH, NB),
									printB(NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),
									verif_solution(NB, pc, ppc, NB, 1, 1, L2, T1, T2, D).

/*
 * make_play para um PC a jogar como PC num jogo entre um jogador humano e um PC
*/

make_play([H|T], pc, T1, T2, D):-	D == 0,
									!,
									list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									find_bestplay([H|T], pc, PLA, BPL, [], 0),
									list_length(BPL, L3),
									L3H is L3//2,
									get_el(PLA, L3H, [R|[CH|_]]),
									make_playaux([H|T], pc, R, CH, NB),
									printB(NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),
									verif_solution(NB, pc, p1, NB, 1, 1, L2, T1, T2, D).
make_play([H|T], pc, T1, T2, D):-	D == 1,
									!,
									list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									find_bestplay([H|T], pc, PLA, BPL, [], 0),
									max(BPL, 1, 1, IF, 0),
									get_el(PLA, IF, [R|[CH|_]]),
									make_playaux([H|T], pc, R, CH, NB),
									printB(NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),
									verif_solution(NB, pc, p1, NB, 1, 1, L2, T1, T2, D).
									
/*
 * make_play para um jogador humano a jogar como jogador 1 num jogo entre um jogador e um PC
*/

make_play([H|T], p1, T1, T2, D):-	list_length(H, L1),
									available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
									set(PLA, PLAF),
									write(PLAF),
									nl,
									write('Select your play. (Pick your play from the list of available plays. Write the row first and the column second.)'),
									read(R),
									read(C),
									verif_play(PLAF,[R,C]),
									!,
									make_playaux([H|T], p1, R, C, NB),
									append(_, [HNB|_], NB),
									list_length(HNB, L2),
									verif_solution(NB, p1, pc, NB, 1, 1, L2, T1, T2, D).
									
/*
 * make_play para um jogador humano a jogar como jogador 1 num jogo entre dois jogadores humanos
*/
									
make_play([H|T], pp1, T1, T2):-	list_length(H, L1),
								available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
								set(PLA, PLAF),
								write(PLAF),
								nl,
								write('Select your play. (Pick your play from the list of available plays. Write the row first and the column second.)'),
								read(R),
								read(C),
								verif_play(PLAF,[R,C]),
								!,
								make_playaux([H|T], p1, R, C, NB),
								printB(NB),
								append(_, [HNB|_], NB),
								list_length(HNB, L2),								
								verif_solution(NB, p1, p2, NB, 1, 1, L2, T1, T2, 0).

/*
 * make_play para um jogador humano a jogar como PC num jogo entre dois jogadores humanos
*/
								
make_play([H|T], p2, T1, T2):-	list_length(H, L1),
								available_plays([H|T], [H|T], 1, 1, L1, [], PLA, 0),
								set(PLA, PLAF),
								write(PLAF),
								nl,
								write('Select your play. (Pick your play from the list of available plays. Write the row first and the column second.)'),
								read(R),
								read(C),
								verif_play(PLAF,[R,C]),
								!,
								make_playaux([H|T], pc, R, C, NB),
								printB(NB),
								append(_, [HNB|_], NB),
								list_length(HNB, L2),
								verif_solution(NB, pc, pp1, NB, 1, 1, L2, T1, T2, 0).

/**
  * O predicado available_plays recebe duas versões do tabuleiro [H|T] e B (uma na qual o tabuleiro vai ser iterado, outra necessária para a localização de elementos no tabuleiro),
  *  a coluna C e a linha R em que estão a ser verificadas jogadas possíveis, o tamanho LL da linha a ser iterada, uma lista de controlo PL e a lista de jogadas finais PLA assim
  * como um iterador I utilizado para garantir a verificação de várias jogadas numa posição e reduzir o tempo de processamento da lista de jogadas disponíveis
  *
*/

available_plays([[]], _, _, _, _, PL, PL, _). /** Caso base do predicado available_plays */
available_plays([_|T], B, C, R, LL, PL, PLA, I):-	I == 0,
													C > LL, /** Quando C é maior que LL, avança-se para a análise da próxima linha do tabuleiro */
													!,
													R1 is R+1,
													append(_, [H1|_], T),
													list_length(H1, L1),
													available_plays(T, B, 1, R1, L1, PL, PLA, 0).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):-	I < 1, /** Aqui é analisada a possiblidade de ser jogada uma peça no topo de um triângulo voltado para baixo controlado pelo jogador 1 */
														H == 3,
														R1 is R-1,
														get_ell(B, C, R1, E),
														E =< 1,
														!,
														append([[R1,C]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 1).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):-	I < 1,
														H == 5, /** Aqui é analisada a possiblidade de ser jogada uma peça no topo de um triângulo voltado para baixo controlado pelo PC */
														R1 is R-1,
														get_ell(B, C, R1, E),
														E =< 1,
														!,
														append([[R1,C]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 1).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):- 	I < 2, /** Aqui é analisada a possiblidade de ser jogada uma peça no lado esquerdo do triângulo na linha R e coluna C */
														H =< 1,
														C1 is C-1,
														get_ell(B, C1, R, E),
														E > 1,
														!,
														append([[R, C]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 2).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):- 	I < 3, /** Aqui é analisada a possiblidade de ser jogada uma peça no lado direito do triângulo na linha R e coluna C */
														H =< 1,
														C1 is C+1,
														get_ell(B, C1, R, E),
														E > 1,
														!,
														append([[R, C]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 3).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):-	I < 4, /** Aqui é analisada a possiblidade de ser jogada uma peça debaixo de um triângulo voltado para cima controlado pelo jogador 1 */
														H == 2,
														R1 is R+1,
														get_ell(B, C, R1, E),
														E =< 1,
														!,
														append([[R1,C]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 4).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):-	I < 4, /** Aqui é analisada a possiblidade de ser jogada uma peça debaixo de um triângulo voltado para cima controlado pelo PC */
														H == 4,
														R1 is R+1,
														get_ell(B, C, R1, E),
														E =< 1,
														!,
														append([[R1,C]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 4).
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):-	I < 5, /**	Aqui é analisada a possiblidade de jogar um triângulo do lado esquerdo de uma linha (ou seja, de colocar um triângulo na primeira posição da linha) */ 
														C == 1,
														H > 1,
														!,
														C1 is C-1,
														append([[R, C1]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 5).	
available_plays([[H|T]|RE], B, C, R, LL, PL, PLA, I):-	I < 6, /**	Aqui é analisada a possiblidade de jogar um triângulo no final de uma linha */
														C == LL,
														H > 1,
														!,
														C1 is C+1,
														append([[R, C1]], PL, PL1),
														available_plays([[H|T]|RE], B, C, R, LL, PL1, PLA, 6).										
available_plays([[_|T]|RE], B, C, R, LL, PL, PLA, _):-	C1 is C+1, /** Aqui é efectuada a mudança da posição a ser analisada pelo aumento da coluna */
														available_plays([T|RE], B, C1, R, LL, PL, PLA, 0).											

/*
 * O predicado find_bestplay recebe o tabuleiro B, o jogador activo, uma lista de jogadas disponíveis , uma variável vazia BPL onde irá ser guardada uma lista com as pontuações
 * de cada jogada, uma variável temporário BPLT que irá ser iterada para a criação de BPL e a pontuação de uma jogada P.
*/ 

/*
 * Predicado find_bestplay para jogador activo como PC (a controlar triângulos 4 e 5)
*/ 

find_bestplay(_, pc, [], BPLT, BPLT, _).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 4,
													get_ell(B, C2, R1, E2),
													E2 == 4,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 4,
													get_ell(B, C2, HP, E2),
													E2 == 4,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 4,
													get_ell(B, C2, HP, E2),
													E2 == 4,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 5,
													get_ell(B, C2, R1, E2),
													E2 == 5,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 5,
													get_ell(B, C2, HP, E2),
													E2 == 5,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 5,
													get_ell(B, C2, HP, E2),
													E2 == 5,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 2,
													get_ell(B, C2, R1, E2),
													E2 == 2,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 2,
													get_ell(B, C2, HP, E2),
													E2 == 2,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 2,
													get_ell(B, C2, HP, E2),
													E2 == 2,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 3,
													get_ell(B, C2, R1, E2),
													E2 == 3,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 3,
													get_ell(B, C2, HP, E2),
													E2 == 3,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 3,
													get_ell(B, C2, HP, E2),
													E2 == 3,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP-2,
													get_ell(B, C1, HP, E1),
													E1 == 4,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP+2,
													get_ell(B, C1, HP, E1),
													E1 == 4,
													!,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP-2,
													get_ell(B, C1, HP, E1),
													E1 == 5,
													!,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP+2,
													get_ell(B, C1, HP, E1),
													E1 == 4,
													!,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, pc, [[_|_]|RE], BPL, BPLT, P):-	!,
													P1 is P+1,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
													
/*
 * Predicado find_bestplay para jogador activo como PPC (a controlar triângulos 2 e 3)
*/ 

find_bestplay(_, ppc, [], BPLT, BPLT, _).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 2,
													get_ell(B, C2, R1, E2),
													E2 == 2,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 2,
													get_ell(B, C2, HP, E2),
													E2 == 2,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 2,
													get_ell(B, C2, HP, E2),
													E2 == 2,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 3,
													get_ell(B, C2, R1, E2),
													E2 == 3,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 3,
													get_ell(B, C2, HP, E2),
													E2 == 3,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 3,
													get_ell(B, C2, HP, E2),
													E2 == 3,
													!,
													P1 is P+5,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 4,
													get_ell(B, C2, R1, E2),
													E2 == 4,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 4,
													get_ell(B, C2, HP, E2),
													E2 == 4,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 4,
													get_ell(B, C2, HP, E2),
													E2 == 4,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP-1,
													C1 is TP-1,
													C2 is TP+1,
													get_ell(B, C1, R1, E1),
													E1 == 5,
													get_ell(B, C2, R1, E2),
													E2 == 5,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP+1,
													C2 is TP+2,
													get_ell(B, C1, R1, E1),
													E1 == 5,
													get_ell(B, C2, HP, E2),
													E2 == 5,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	R1 is HP+1,
													C1 is TP-1,
													C2 is TP-2,
													get_ell(B, C1, R1, E1),
													E1 == 5,
													get_ell(B, C2, HP, E2),
													E2 == 5,
													!,
													P1 is P+4,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP-2,
													get_ell(B, C1, HP, E1),
													E1 == 2,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP+2,
													get_ell(B, C1, HP, E1),
													E1 == 2,
													!,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP-2,
													get_ell(B, C1, HP, E1),
													E1 == 3,
													!,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[HP|TP]|RE], BPL, BPLT, P):-	C1 is TP+2,
													get_ell(B, C1, HP, E1),
													E1 == 2,
													!,
													P1 is P+2,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).
find_bestplay(B, ppc, [[_|_]|RE], BPL, BPLT, P):-	!,
													P1 is P+1,
													append(BPLT, [P1], BPLT1),
													find_bestplay(B, pc, RE, BPL, BPLT1, 0).					

/*
 *
 * PREDICADOS ENVOLVIDOS NO FUNCIONAMENTO DE MAKE_PLAYAUX
 *
 *
*/ 
					
/*
 * O predicado update_rboard recebe uma lista de listas, uma variável vazia onde vai ser guardado o tabuleiro NB e uma variável que vai guardar o tabuleiro final temporariamente.
 * Sempre que é colocado um triângulo no início de uma linha, é colocado um triângulo vazio no início de todas as outras linhas no tabuleiro para ajustar a entrada do novo triângulo.
 *
 *
*/ 
											
update_rboard([], NBT, NBT).
update_rboard([H|T], NB, NBT):-	get_el(H, 1, E),
								E == 0,
								!,
								append([1], H, NB1),
								append(NBT, [NB1], NBT1),
								update_rboard(T, NB, NBT1).
update_rboard([H|T], NB, NBT):-	get_el(H, 1, E),
								E == 2,
								!,
								append([1], H, NB1),
								append(NBT, [NB1], NBT1),
								update_rboard(T, NB, NBT1).
update_rboard([H|T], NB, NBT):-	get_el(H, 1, E),
								E == 4,
								!,
								append([1], H, NB1),
								append(NBT, [NB1], NBT1),
								update_rboard(T, NB, NBT1).
update_rboard([H|T], NB, NBT):-	get_el(H, 1, E),
								E == 1,
								!,
								append([0], H, NB1),
								append(NBT, [NB1], NBT1),
								update_rboard(T, NB, NBT1).
update_rboard([H|T], NB, NBT):-	get_el(H, 1, E),
								E == 3,
								!,
								append([0], H, NB1),
								append(NBT, [NB1], NBT1),
								update_rboard(T, NB, NBT1).
update_rboard([H|T], NB, NBT):-	get_el(H, 1, E),
								E == 5,
								!,
								append([0], H, NB1),
								append(NBT, [NB1], NBT1),
								update_rboard(T, NB, NBT1).										

/*
 *	make_playaux é um predicado que recebe o tabuleiro actual, o jogador activo, a linha R e coluna C onde vai ser acrescentado o novo triângulo e uma variável vazia NB, correspondente
 * ao tabuleiro actualizado. 
*/

make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E == -1,
									R == 0,
									!,
									make_playaux_row([H|T], P, R, C, NB, _, []).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E == -1,
									list_length([H|T], LL),
									R > LL,
									!,
									make_playaux_row([H|T], P, R, C, NB, _, []).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E == -1,
									C == 0,
									!,
									make_playaux_column([H|T], P, R, C, NB, []).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E == -1,
									!,
									make_playaux_column([H|T], P, R, C, NB, []).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E =\= -1,
									E == 0,
									P == p1,
									!,
									replace([H|T], R, C, 2, NB).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E =\= -1,
									E == 0,
									P == pc,
									!,
									replace([H|T], R, C, 4, NB).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E =\= -1,
									E == 1,
									P == p1,
									!,
									replace([H|T], R, C, 3, NB).
make_playaux([H|T], P, R, C, NB):-	get_ell([H|T], C, R, E),
									E =\= -1,
									E == 1,
									P == pc,
									!,
									replace([H|T], R, C, 5, NB).

/*
 * make_playaux_column é um predicado que recebe o tabuleiro actual, o jogador activo, a linha R e coluna C onde vai ser colocado o novo triângulo, uma variável vazia NB onde vai ser
 * guardado o tabuleiro actualizado e uma variável onde é guardada a parte da frente do tabuleiro (o tabuleiro vai ser iterado de acordo com a linha onde vai ser acrescentado o triângulo)
*/ 

/*
 * Predicados do make_playaux_column para o P1
*/

make_playaux_column([H|T], p1, R, C, NB, HB):-	R > 1,
												R1 is R-1,
												!,
												append(HB, [H], HB1),
												make_playaux_column(T, p1, R1, C, NB, HB1).
make_playaux_column([H|T], p1, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 2,
												!,
												append([3], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 4,
												!,
												append([3], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 3,
												!,
												append([2], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 5,
												!,
												append([2], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 2,
												!,
												append(H, [3], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 4,
												!,
												append(H, [3], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 3,
												!,
												append(H, [2], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 5,
												!,
												append(H, [2], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 2,
												!,
												append([3], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 4,
												!,
												append([3], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 3,
												!,
												append([2], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 5,
												!,
												append([2], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 2,
												!,
												append(H, [3], H1),
												append([H1], T, T1),
												append(HB, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 4,
												!,
												append(H, [3], H1),
												append([H1], T, T1),
												append(HB, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 3,
												!,
												append(H, [2], H1),
												append([H1], T, T1),
												append(HB, T1, NB).
make_playaux_column([H|T], p1, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 5,
												!,
												append(H, [2], H1),
												append([H1], T, T1),
												append(HB, T1, NB).

/*
 * Predicados do make_playaux_column para o PC
*/

make_playaux_column([H|T], pc, R, C, NB, HB):-	R > 1,
												R1 is R-1,
												!,
												append(HB, [H], HB1),
												make_playaux_column(T, pc, R1, C, NB, HB1).
make_playaux_column([H|T], pc, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 2,
												!,
												append([5], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 4,
												!,
												append([5], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 3,
												!,
												append([4], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	C == 0,
												get_el(H, 1, E),
												E == 5,
												!,
												append([4], H, H1),
												update_rboard(T, NT, _),
												append([H1], NT, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 2,
												!,
												append(H, [5], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 4,
												!,
												append(H, [5], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 3,
												!,
												append(H, [4], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, []):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 5,
												!,
												append(H, [4], H1),
												append([H1], T, T1),
												append([], T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 2,
												!,
												append([5], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 4,
												!,
												append([5], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 3,
												!,
												append([4], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	C == 0,
												get_el(H, 1, E),
												E == 5,
												!,
												append([4], H, H1),
												update_rboard(T, NT, []),
												append([H1], NT, T1),
												update_rboard(HB, HBT, []),
												append(HBT, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 2,
												!,
												append(H, [5], H1),
												append([H1], T, T1),
												append(HB, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 4,
												!,
												append(H, [5], H1),
												append([H1], T, T1),
												append(HB, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 3,
												!,
												append(H, [4], H1),
												append([H1], T, T1),
												append(HB, T1, NB).
make_playaux_column([H|T], pc, 1, C, NB, HB):-	list_length(H, LL),
												C > LL,
												get_el(H, LL, E),
												E == 5,
												!,
												append(H, [4], H1),
												append([H1], T, T1),
												append(HB, T1, NB).

/*
 * O predicado make_playaux_row recebe o tabuleiro actual B, o jogador activo, a linha R e coluna C, uma variável vazia NB em que vai ser guardado o tabuleiro actualizado, uma
 * variável vazia NR onde vai ser guardada a nova linha criada e uma variável temporária NRT que vai ser iterada para a criação da nova linha.
*/

/*
 * Predicados make_playaux_row para o P1
*/

make_playaux_row(B, p1, R, C, NB, NR, NRT):-	R == 0,
												!,
												append([2], NRT, NRT1),
												make_playaux_rowinc(C, NR, NRT1, 1),
												append([NR], B, NB).
make_playaux_row(B, p1, _, C, NB, NR, NRT):-	append([3], NRT, NRT1),
												make_playaux_rowinc(C, NR, NRT1, 1),
												append(B, [NR], NB).
/*
 * Predicados make_playaux_row para o PC
*/			
									
make_playaux_row(B, pc, R, C, NB, NR, NRT):-	R == 0,
												!,
												append([4], NRT, NRT1),
												make_playaux_rowinc(C, NR, NRT1, 1),
												append([NR], B, NB).
make_playaux_row(B, pc, _, C, NB, NR, NRT):-	append([5], NRT, NRT1),
												make_playaux_rowinc(C, NR, NRT1, 1),
												append(B, [NR], NB).

/*
 * O predicado make_playaux_rowinc recebe um contador, uma variável vazia NR onde vai ser guardada a nova linha criada e uma variável temporária NRT. Este predicado cria uma
 * nova linha e preenche-a com triângulos vazios até ao triângulo a ser adicionado para permitir a visualização da nova linha 
*/

make_playaux_rowinc(C, NRT, NRT, C).
make_playaux_rowinc(C, NR, [H|T], I):-	H == 2,
										append([1], [H|T], NRT1),
										I1 is I+1,
										make_playaux_rowinc(C, NR, NRT1, I1).
make_playaux_rowinc(C, NR, [H|T], I):-	H == 4,
										append([1], [H|T], NRT1),
										I1 is I+1,
										make_playaux_rowinc(C, NR, NRT1, I1).
make_playaux_rowinc(C, NR, [H|T], I):-	H == 0,
										append([1], [H|T], NRT1),
										I1 is I+1,
										make_playaux_rowinc(C, NR, NRT1, I1).
make_playaux_rowinc(C, NR, [H|T], I):-	H == 3,
										append([0], [H|T], NRT1),
										I1 is I+1,
										make_playaux_rowinc(C, NR, NRT1, I1).
make_playaux_rowinc(C, NR, [H|T], I):-	H == 5,
										append([0], [H|T], NRT1),
										I1 is I+1,
										make_playaux_rowinc(C, NR, NRT1, I1).
make_playaux_rowinc(C, NR, [H|T], I):-	H == 1,
										append([0], [H|T], NRT1),
										I1 is I+1,
										make_playaux_rowinc(C, NR, NRT1, I1).													
/*
 * Predicado verif_solution recebe um tabuleiro sobre o qual vai iterar, o jogador activo P, um tabuleiro de controlo B, a linha R e coluna C em que está a verificar se o triângulo
 * faz parte da solução, o tamanho da linha LL actual em que está a verificar se os triângulos fazem parte da solução. Caso uma solução tenho sido encontrada, o programa termina com
 * um vencedor.
*/

verif_solution([[]], p1, pc, B, _, _, _, T1, T2, D):-	T1 > 1,
														T2 > 1,
														T11 is T1-1,
														make_play(B, pc, T11, T2, D).
verif_solution([[]], ppc, pc, B, _, _, _, T1, T2, D):-	T1 > 1,
														T2 > 1,
														T11 is T1-1,
														make_play(B, ppc2, T11, T2, D).
verif_solution([[]], p1, p2, B, _, _, _, T1, T2, _):-	T1 > 1,
														T2 > 1,
														T11 is T1-1,
														make_play(B, p2, T11, T2).
verif_solution([[]], pc, p1, B, _, _, _, T1, T2, D):-	T2 > 1,
														T1 > 1,
														T21 is T2-1,
														make_play(B, p1, T1, T21, D).
verif_solution([[]], pc, pp1, B, _, _, _, T1, T2, _):-	T2 > 1,
														T1 > 1,
														T21 is T2-1,
														make_play(B, pp1, T1, T21).
verif_solution([[]], pc, ppc, B, _, _, _, T1, T2, D):-	T2 > 1,
														T1 > 1,
														T21 is T2-1,
														make_play(B, ppc, T1, T21, D).
verif_solution([[]], p1, pc, B, _, _, _, T1, T2, D) :-	T1 == 1,
														T2 > 1,
														T11 is T1-1,
														write('Player 1 has run out of moves!'),
														nl,
														make_play(B, pc, T11, T2, D).
verif_solution([[]], ppc, pc, B, _, _, _, T1, T2, D) :-	T1 == 1,
														T2 > 1,
														T11 is T1-1,
														write('Player 1 has run out of moves!'),
														nl,
														make_play(B, pc, T11, T2, D).
			
verif_solution([[]], p1, p2, B, _, _, _, T1, T2, _):-	T1 == 1,
														T2 > 1,
														T11 is T1-1,
														write('Player 1 has run out of moves!'),
														nl,
														make_play(B, p2, T11, T2).
verif_solution([[]], pc, p1, B, _, _, _, T1, T2, D):-	T2 == 1,
														T1 > 1,
														T21 is T2-1,
														write('PC has run out of moves!'),
														nl,
														make_play(B, p1, T1, T21, D).
verif_solution([[]], pc, pp1, B, _, _, _, T1, T2, _):-	T2 == 1,
														T1 > 1,
														T21 is T2-1,
														write('PC has run out of moves!'),
														nl,
														make_play(B, pp1, T1, T21).
verif_solution([[]], pc, ppc, B, _, _, _, T1, T2, D):-	T2 == 1,
														T1 > 1,
														T21 is T2-1,
														write('PC has run out of moves!'),
														nl,
														make_play(B, ppc2, T1, T21, D).
verif_solution([[]], p1, _, _, _, _, _, T1, T2, _):-	T1 == 1,
														T2 == 1,
														write('Both players have run out of moves! Game ends in draw.'),
														nl.
verif_solution([[]], pc, _, _, _, _, _, T1, T2, _):-	T1 == 1,
														T2 == 1,
														write('Both players have run out of moves! Game ends in draw.'),
														nl.
verif_solution([[]], ppc, _, _, _, _, _, T1, T2, _):-	T1 == 1,
														T2 == 1,
														write('Both players have run out of moves! Game ends in draw.'),
														nl.
verif_solution([_|T], P, P2, B, C, R, LL, T1, T2, D):-	C > LL,
														!,
														R1 is R+1,
														append(_, [H1|_], T),
														list_length(H1, L1),
														verif_solution(T, P, P2, B, 1, R1, L1, T1, T2, D).
/*
 * Predicados verif_solution para P1
*/												
verif_solution([[H|_]|_], p1, _, B, C, R, _, _, _, _):-	H == 2,
														C1 is C-1,
														R1 is R+1,
														get_ell(B, C1, R1, E2),
														E2 == 2,
														C2 is C+1,
														get_ell(B, C2, R1, E3),
														E3 == 2,
														!,
														write('Player 1 wins'),
														nl.
verif_solution([[H|_]|_], p1, _, B, C, R, _, _, _, _):-	H == 3,
														C1 is C-1,
														R1 is R-1,
														get_ell(B, C1, R1, E2),
														E2 == 3,
														C2 is C+1,
														get_ell(B, C2, R1, E3),
														E3 == 3,
														!,
														write('Player 1 wins'),
														nl.
verif_solution([[_|T]|RE], p1, P2, B, C, R, LL, T1, T2, D):-	C1 is C+1,
																verif_solution([T|RE], p1, P2, B, C1, R, LL, T1, T2, D).
																
/*
 * Predicados verif_solution para PPC
*/ 
																
verif_solution([[H|_]|_], ppc, _, B, C, R, _, _, _, _):-	H == 2,
															C1 is C-1,
															R1 is R+1,
															get_ell(B, C1, R1, E2),
															E2 == 2,
															C2 is C+1,
															get_ell(B, C2, R1, E3),
															E3 == 2,
															!,
															write('Player 1 wins'),
															nl.
verif_solution([[H|_]|_], ppc, _, B, C, R, _, _, _, _):-	H == 3,
															C1 is C-1,
															R1 is R-1,
															get_ell(B, C1, R1, E2),
															E2 == 3,
															C2 is C+1,
															get_ell(B, C2, R1, E3),
															E3 == 3,
															!,
															write('Player 1 wins'),
															nl.
verif_solution([[_|T]|RE], ppc, P2, B, C, R, LL, T1, T2, D):-	C1 is C+1,
																verif_solution([T|RE], p1, P2, B, C1, R, LL, T1, T2, D).
/*
 * Predicados verif_solution para PC
*/ 

verif_solution([[H|_]|_], pc, _, B, C, R, _, _, _, _):-	H == 4,
														C1 is C-1,
														R1 is R+1,
														get_ell(B, C1, R1, E2),
														E2 == 4,
														C2 is C+1,
														get_ell(B, C2, R1, E3),
														E3 == 4,
														!,
														write('PC wins'),
														nl.
verif_solution([[H|_]|_], pc, _, B, C, R, _, _, _, _):-	H == 5,
														C1 is C-1,
														R1 is R-1,
														get_ell(B, C1, R1, E2),
														E2 == 5,
														C2 is C+1,
														get_ell(B, C2, R1, E3),
														E3 == 5,
														!,
														write('PC wins'),
														nl.
verif_solution([[_|T]|RE], pc, P2, B, C, R, LL, T1, T2, D):-	C1 is C+1,
																verif_solution([T|RE], pc, P2, B, C1, R, LL, T1, T2, D).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Used by the Server %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/*
 * Predicado verif_solution recebe um tabuleiro sobre o qual vai iterar, o jogador activo P, um tabuleiro de controlo B, a linha R e coluna C em que está a verificar se o triângulo
 * faz parte da solução, o tamanho da linha LL actual em que está a verificar se os triângulos fazem parte da solução. Caso uma solução tenho sido encontrada, o programa termina com
 * um vencedor.
*/


ver_sol_aux(S,T1,T2,R):-append([],[S,T1,T2], R).

verif_solution_([[]], p1, pc, B, _, _, _, T1, T2, D, R):-	T1 > 1,
                                                            T2 > 1,
                                                            T11 is T1-1,
                                                            ver_sol_aux('C',T11,T2,R).
verif_solution_([[]], ppc, pc, B, _, _, _, T1, T2, D, R):-	T1 > 1,
                                                            T2 > 1,
                                                            T11 is T1-1,
                                                            ver_sol_aux('C',T11,T2,R).
verif_solution_([[]], p1, p2, B, _, _, _, T1, T2, _, R):-	T1 > 1,
                                                            T2 > 1,
                                                            T11 is T1-1,
                                                            ver_sol_aux('C',T11,T2,R).
verif_solution_([[]], pc, p1, B, _, _, _, T1, T2, D, R):-	T2 > 1,
                                                            T1 > 1,
                                                            T21 is T2-1,
                                                            ver_sol_aux('C',T1,T21,R).
verif_solution_([[]], pc, pp1, B, _, _, _, T1, T2, _, R):-	T2 > 1,
                                                            T1 > 1,
                                                            T21 is T2-1,
                                                            ver_sol_aux('C',T1,T21,R).
verif_solution_([[]], pc, ppc, B, _, _, _, T1, T2, D, R):-	T2 > 1,
                                                            T1 > 1,
                                                            T21 is T2-1,
                                                            ver_sol_aux('Player 1 has run out of moves!',T1,T21,R).
verif_solution_([[]], p1, pc, B, _, _, _, T1, T2, D, R) :-	T1 == 1,
                                                            T2 > 1,
                                                            T11 is T1-1,
                                                            ver_sol_aux('Player 1 has run out of moves!',T11,T2,R).
verif_solution_([[]], ppc, pc, B, _, _, _, T1, T2, D, R) :-	T1 == 1,
                                                            T2 > 1,
                                                            T11 is T1-1,
                                                            ver_sol_aux('Player 1 has run out of moves!',T11,T2,R).
verif_solution_([[]], p1, p2, B, _, _, _, T1, T2, _, R):-	T1 == 1,
                                                            T2 > 1,
                                                            T11 is T1-1,
                                                            ver_sol_aux('Player 1 has run out of moves!',T11,T2,R).
verif_solution_([[]], pc, p1, B, _, _, _, T1, T2, D, R):-	T2 == 1,
                                                            T1 > 1,
                                                            T21 is T2-1,
                                                            ver_sol_aux('PC has run out of moves!',T1,T21,R).
verif_solution_([[]], pc, pp1, B, _, _, _, T1, T2, _, R):-	T2 == 1,
                                                            T1 > 1,
                                                            T21 is T2-1,
                                                            ver_sol_aux('PC has run out of moves!',T1,T21,R).
verif_solution_([[]], pc, ppc, B, _, _, _, T1, T2, D, R):-	T2 == 1,
                                                            T1 > 1,
                                                            T21 is T2-1,
                                                            ver_sol_aux('PC has run out of moves!',T1,T21,R).
verif_solution_([[]], p1, _, _, _, _, _, T1, T2, _, R):-	T1 == 1, % Both players have run out of moves! Game ends in draw.
                                                            T2 == 1,
														    ver_sol_aux('Both players have run out of moves! Game ends in draw.',T1,T2,R).
verif_solution_([[]], pc, _, _, _, _, _, T1, T2, _, R):-	T1 == 1, % Both players have run out of moves! Game ends in draw.
														    T2 == 1,
														    ver_sol_aux('Both players have run out of moves! Game ends in draw.',T1,T2,R).
verif_solution_([[]], ppc, _, _, _, _, _, T1, T2, _, R):-	T1 == 1, % Both players have run out of moves! Game ends in draw.
														    T2 == 1,
														    ver_sol_aux('Both players have run out of moves! Game ends in draw.',T1,T2,R).
verif_solution_([_|T], P, P2, B, C, R, LL, T1, T2, D, Res):-	C > LL,
                                                            !,
                                                            R1 is R+1,
                                                            append(_, [H1|_], T),
                                                            list_length(H1, L1),
                                                            verif_solution_(T, P, P2, B, 1, R1, L1, T1, T2, D, Res).
/*
 * Predicados verif_solution_ para P1
*/
verif_solution_([[H|_]|_], p1, _, B, C, R, _, _, _, _, Res):-	H == 2, % Player 1 wins
                                                            C1 is C-1,
                                                            R1 is R+1,
                                                            get_ell(B, C1, R1, E2),
                                                            E2 == 2,
                                                            C2 is C+1,
                                                            get_ell(B, C2, R1, E3),
                                                            E3 == 2,
                                                            !,
                                                            ver_sol_aux('Player 1 wins.',0,0,Res).
verif_solution_([[H|_]|_], p1, _, B, C, R, _, _, _, _, Res):-	H == 3, % % Player 1 wins
                                                            C1 is C-1,
                                                            R1 is R-1,
                                                            get_ell(B, C1, R1, E2),
                                                            E2 == 3,
                                                            C2 is C+1,
                                                            get_ell(B, C2, R1, E3),
                                                            E3 == 3,
                                                            !,
                                                            ver_sol_aux('Player 1 wins.',0,0,Res).
verif_solution_([[_|T]|RE], p1, P2, B, C, R, LL, T1, T2, D, Res):-	C1 is C+1,
																    verif_solution_([T|RE], p1, P2, B, C1, R, LL, T1, T2, D, Res).

/*
 * Predicados verif_solution_ para PPC
*/

verif_solution_([[H|_]|_], ppc, _, B, C, R, _, _, _, _, Res):-	H == 2, % Player 1 wins
                                                                C1 is C-1,
                                                                R1 is R+1,
                                                                get_ell(B, C1, R1, E2),
                                                                E2 == 2,
                                                                C2 is C+1,
                                                                get_ell(B, C2, R1, E3),
                                                                E3 == 2,
                                                                !,
                                                                ver_sol_aux('Player 1 wins.',0,0,Res).
verif_solution_([[H|_]|_], ppc, _, B, C, R, _, _, _, _, Res):-	H == 3, % Player 1 wins
                                                                C1 is C-1,
                                                                R1 is R-1,
                                                                get_ell(B, C1, R1, E2),
                                                                E2 == 3,
                                                                C2 is C+1,
                                                                get_ell(B, C2, R1, E3),
                                                                E3 == 3,
                                                                !,
                                                                ver_sol_aux('Player 1 wins.',0,0,Res).
verif_solution_([[_|T]|RE], ppc, P2, B, C, R, LL, T1, T2, D, Res):-	C1 is C+1,
																verif_solution_([T|RE], p1, P2, B, C1, R, LL, T1, T2, D, Res).
/*
 * Predicados verif_solution_ para PC
*/

verif_solution_([[H|_]|_], pc, _, B, C, R, _, _, _, _, Res):-	H == 4, % PC wins!
                                                            C1 is C-1,
                                                            R1 is R+1,
                                                            get_ell(B, C1, R1, E2),
                                                            E2 == 4,
                                                            C2 is C+1,
                                                            get_ell(B, C2, R1, E3),
                                                            E3 == 4,
                                                            !,
                                                            ver_sol_aux('PC wins.',0,0,Res).
verif_solution_([[H|_]|_], pc, _, B, C, R, _, _, _, _, Res):-	H == 5,
                                                            C1 is C-1,
                                                            R1 is R-1,
                                                            get_ell(B, C1, R1, E2),
                                                            E2 == 5,
                                                            C2 is C+1,
                                                            get_ell(B, C2, R1, E3),
                                                            E3 == 5,
                                                            !,
                                                            ver_sol_aux('PC wins.',0,0,Res).
verif_solution_([[_|T]|RE], pc, P2, B, C, R, LL, T1, T2, D, Res):-	C1 is C+1,
																verif_solution_([T|RE], pc, P2, B, C1, R, LL, T1, T2, D, Res).