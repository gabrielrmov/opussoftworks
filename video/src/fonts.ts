import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fontes oficiais da identidade (variáveis, subset latin — cobre acentuação pt-BR).
loadFont({family: 'Exo 2', url: staticFile('fonts/Exo2-Variable.woff2'), weight: '100 900'});
loadFont({family: 'Rubik', url: staticFile('fonts/Rubik-Variable.woff2'), weight: '300 900'});
// Fonte do site opussoftworks.com.br, usada só na réplica do site dentro dos mockups.
loadFont({family: 'Inter Tight', url: staticFile('fonts/InterTight-Variable.woff2'), weight: '100 900'});
