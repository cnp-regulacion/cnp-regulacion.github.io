// Based loosely from this D3 bubble graph https://bl.ocks.org/mbostock/4063269
// And this Forced directed diagram https://bl.ocks.org/mbostock/4062045
let data = [{
    cat: 'Ministerio de Vivienda y Urbanismo', name: 'Certificado de Informaciones Previas', value: 100,
    icon: 'CIP',
    desc: `
				DECRETO Nº 47/1992, DEL MINISTERIO DE VIVIENDA Y URBANISMO, ORDENANZA GENERAL DE LA LEY GENERAL DE URBANISMO Y CONSTRUCCIONES, ART. 1.4.4.
			`
}, {
    cat: 'Ministerio de Bienes Nacionales', name: 'Petición de Desafectación', value: 10,
    icon: 'img/names_5.png',
    desc: `
				DECRETO Nº 1939/1977, DEL MINISTERIO DE TIERRAS Y COLONIZACION, NORMAS SOBRE ADQUISICION, ADMINISTRACION Y DISPOSICION DE BIENES DEL ESTADO, ART. 64 Y 65.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'Declaración de Interés Nacional', value: 70,
    icon: 'DIN',
    desc: `
				"LEY Nº 20.283/2008, DEL MINISTERIO DE AGRICULTURA, 
LEY SOBRE RECUPERACIÓN DEL BOSQUE NATIVO Y FOMENTO FORESTAL, ART. 19."
			`
}, {
    cat: 'Ministerio de Energía', name: 'Concesión Eléctrica', value: 40,
    icon: 'Eléctrica',
    desc: `
				D.F.L Nº 4/20018/2006, DEL MINISTERIO DE ECONOMIA, FOMENTO Y RECONSTRUCCION, FIJA TEXTO REFUNDIDO, COORDINADO Y SISTEMATIZADO DEL DECRETO CON FUERZA DE LEY N°1, DE MINERIA, DE 1982, LEY GENERAL DE SERVICIOS ELECTRICOS, EN MATERIA DE ENERGIA ELECTRICA, ART. 19 (CONCESION PROVISIONAL) Y ART. 25 (CONCESION DEFINITIVA).
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 127', value: 30,
    icon: 'img/names_2.png',
    desc: `
				D.S Nº 490/1976, DEL MINISTERIO DE AGRICULTURA, DECLARA MONUMENTO NATURAL A LA ESPECIE FORESTAL ALERCE, ART. 2.`
}, {
    cat: 'Ministerio de Desarrollo Social', name: 'Presencia de Territorio Indígena', value: 30,
    icon: 'Indígena',
    desc: `
				LEY Nº 19.253/1993, DEL MINISTERIO DE PLANIFICACION Y COOPERACION, ESTABLECE NORMAS SOBRE PROTECCION, FOMENTO Y DESARROLLO DE LOS INDIGENAS, Y CREA LA CORPORACION NACIONAL DE DESARROLLO INDIGENA, ART. 12 Y 15.
			`
}, {
    cat: 'Ministerio de Economía, Fomento y Turismo', name: 'PAS 119', value: 20,
    icon: 'PAS 119',
    desc: `
				D.S Nº 430/1991, DEL MINISTERIO DE ECONOMIA, FOMENTO Y RECONSTRUCCION, QUE FIJA EL TEXTO REFUNDIDO, COORDINADO Y SISTEMATIZADO DE LA LEY N° 18.892, DE 1989 Y SUS MODIFICACIONES, LEY GENERAL DE PESCA Y ACUICULTURA, ART. 99.
			`
}, {
    cat: 'Ministerio de Educación', name: 'PAS 131', value: 80,
    icon: 'PAS 131',
    desc: `
				LEY Nº 17.288/1970, DEL MINISTERIO DE EDUCACION PUBLICA, LEGISLA SOBRE MONUMENTOS NACIONALES, ART. 11 Y 12.
			`
}, {
    cat: 'Ministerio de Educación', name: 'PAS 132', value: 30,
    icon: 'PAS 132',
    desc: `
				LEY Nº 17.288/1970, DEL MINISTERIO DE EDUCACION PUBLICA, LEGISLA SOBRE MONUMENTOS NACIONALES, ART. 22 Y 23. / DECRETO Nº 484/1990, DEL MINISTERIO DE EDUCACION, REGLAMENTO DE LA LEY N° 17.288, SOBRE EXCAVACIONES Y/O PROSPECCIONES ARQUEOLOGICAS, ANTROPOLOGICAS Y PALEONTOLOGICAS, ART. 7, 8 Y 9.
			`
}, /*{
			cat: 'framework', name: 'Trails.JS', value: 10,
			icon: '',
		},*/ {
    cat: 'Ministerio de Agricultura', name: 'PAS 124', value: 50,
    icon: 'PAS 124',
    desc: `
				LEY Nº 19.473/1996, DEL MINISTERIO DE AGRICULTURA, SUSTITUYE TEXTO DE LA LEY Nº 4.601, SOBRE CAZA, Y ARTICULO 609 DEL CODIGO CIVIL, ART. 9.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 127', value: 10,
    icon: 'img/names_2.png',
    desc: `
			D.S Nº 490/1976, DEL MINISTERIO DE AGRICULTURA, DECLARA MONUMENTO NATURAL A LA ESPECIE FORESTAL ALERCE, ART. 2.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 128', value: 30,
    icon: 'PAS 128',
    desc: `
				D.S Nº 43/1990, DEL MINISTERIO DE AGRICULTURA, DECLARA MONUMENTO NATURAL A LA ARAUCARIA ARAUCANA, ART. 2.
			`
}, /*{
			cat: 'framework', name: 'Foundation', value: 10,
			icon: '',
		},*/{
    cat: 'Ministerio de Agricultura', name: 'PAS 129', value: 50,
    icon: 'PAS 129',
    desc: `
				D.S Nº 13/1995, DEL MINISTERIO DE AGRICULTURA, DECLARA MONUMENTO NATURAL A LAS ESPECIES FORESTALES QUEULE, PITAO, BELLOTO DEL SUR, BELLOTO DEL NORTE Y RUIL, ART. 2.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'Evaluación Ambiental', value: 100,
    icon: 'img/names.png',
    desc: `
				DECRETO Nº 40/2012, DEL MINISTERIO DEL MEDIO AMBIENTE, APRUEBA REGLAMENTO DEL SISTEMA DE EVALUACION DE IMPACTO AMBIENTAL, ART. 28.
			`
}, /*{
			cat: 'framework', name: 'SenchaTouch', value: 10,
			icon: '',
		},*/ {
    cat: 'Ministerio de Agricultura', name: 'PAS 120', value: 10,
    icon: 'img/names_1.png',
    desc: `
				LEY Nº 17.288/1970, DEL MINISTERIO DE EDUCACION PUBLICA, LEGISLA SOBRE MONUMENTOS NACIONALES, ART. 31. INCISO 3º.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 123', value: 70,
    icon: 'PAS 123',
    desc: `
				LEY Nº 19.473/1996, DEL MINISTERIO DE AGRICULTURA, SUSTITUYE TEXTO DE LA LEY Nº 4.601, SOBRE CAZA, Y ARTICULO 609 DEL CODIGO CIVIL, ART. 25, INCISO 2º.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 126', value: 30,
    icon: 'PAS 126',
    desc: `
				D.S Nº 4/2009, DEL MINISTERIO SECRETARIA GENERAL DE LA PRESIDENCIA, REGLAMENTO PARA EL MANEJO DE LODOS GENERADOS EN PLANTAS DE TRATAMIENTO DE AGUAS SERVIDAS, ART. 9.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 127', value: 100,
    icon: 'PAS 127',
    desc: `
				D.S Nº 490/1976, DEL MINISTERIO DE AGRICULTURA, DECLARA MONUMENTO NATURAL A LA ESPECIE FORESTAL ALERCE, ART. 2.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'PAS 129', value: 50,
    icon: 'PAS 129',
    desc: `
				D.S Nº 13/1995, DEL MINISTERIO DE AGRICULTURA, DECLARA MONUMENTO NATURAL A LAS ESPECIES FORESTALES QUEULE, PITAO, BELLOTO DEL SUR, BELLOTO DEL NORTE Y RUIL, ART. 2.
			`
}, {
    cat: 'Ministerio de Agricultura', name: 'Resolución de Calificación Ambiental', value: 120,
    icon: 'RCA',
    desc: `
			LEY Nº 19.300/1994, DEL MINISTERIO SECRETARIA GENERAL DE LA PRESIDENCIA, APRUEBA LEY SOBRE BASES GENERALES DEL MEDIO AMBIENTE, ART. 24.
			`
}, {
    cat: 'Ministerio de Salud', name: 'PAS 138', value: 20,
    icon: 'PAS 138',
    desc: `
				D.F.L Nº 725/1967, DEL MINISTERIO DE SALUD PUBLICA, CODIGO SANITARIO, ART. 71 LETRA B) .
			`
}, {
    cat: 'Ministerio de Salud', name: 'PAS 139', value: 30,
    icon: 'PAS 139',
    desc: `
				D.F.L Nº 725/1967, DEL MINISTERIO DE SALUD PUBLICA, CODIGO SANITARIO, ART. 71 LETRA B) .
			`
}, {
    cat: 'Ministerio de Salud', name: 'PAS 140', value: 30,
    icon: 'PAS 140',
    desc: `
				D.F.L Nº 725/1967, DEL MINISTERIO DE SALUD PUBLICA, CODIGO SANITARIO, ART. 79 Y 80
			`
}, {
    cat: 'Ministerio de Salud', name: 'PAS 142', value: 10,
    icon: 'img/names_4.png',
    desc: `
				D.S Nº 148/2003, DEL MINISTERIO DE SALUD, REGLAMENTO SANITARIO SOBRE MANEJO DE RESIDUOS PELIGROSOS, ART. 29.
			`
}, {
    cat: 'Ministerio de Salud', name: 'PAS 145', value: 50,
    icon: 'PAS 145',
    desc: `
				D.S Nº 148/2003, DEL MINISTERIO DE SALUD, REGLAMENTO SANITARIO SOBRE MANEJO DE RESIDUOS PELIGROSOS, ART. 52.
			`
}, {
    cat: 'Ministerio de Salud', name: 'PAS 161', value: 10,
    icon: 'img/names_3.png',
    desc: `
				DECRETO Nº 47/1992, DEL MINISTERIO DE VIVIENDA Y URBANISMO, ORDENANZA GENERAL DE LA LEY GENERAL DE URBANISMO Y CONSTRUCCIONES, ART. 4.14.2.
			`
}, {
    cat: 'Ministerio de Educación', name: 'PAS 131', value: 30,
    icon: 'PAS 131',
    desc: `
				LEY Nº 17.288/1970, DEL MINISTERIO DE EDUCACION PUBLICA, LEGISLA SOBRE MONUMENTOS NACIONALES, ART. 11 Y 12.
			`
}, {
    cat: 'Ministerio de Obras Públicas', name: 'PAS 159', value: 20,
    icon: 'PAS 159',
    desc: `
				LEY Nº 11.402/1953, DEL MINISTERIO DE OBRAS PUBLICAS, DISPONE QUE LAS OBRAS DE DEFENSA Y REGULARIZACION DE LAS RIBERAS Y CAUCES DE LOS RIOS, LAGUNAS Y ESTEROS QUE SE REALICEN CON PARTICIPACION FISCAL, SOLAMENTE PODRAN SER EJECUTADAS Y PROYECTADAS POR LA DIRECCION DE OBRAS SANITARIAS DEL MINISTERIO DE OBRAS PUBLICAS, ART. 11.
			`
}];