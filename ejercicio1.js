const objetos =  [
	{
		manzanas:3,
		peras:2,
		carne:1,
		jugos:5,
		dulces:2
	},
	{
		manzanas:1,
		sandias:1,
		huevos:6,
		jugos:1,
		panes:4
	}
]


//console.log(objetos)

const nuevoArray =[]
objetos.forEach((objeto) => {
    const keys =Object.keys(objeto)
    console.log(keys)
    keys.forEach(key => {
        if (!nuevoArray.includes(key)) nuevoArray.push(key);
    })
    return keys
})

console.log(nuevoArray)


// const categoriasUnicas = nuevoArray.reduce((acumulador,categoria) =>{
//     categoria.forEach((item) => {
//         if(!acumulador.includes(item)){
//             acumulador.push(item)
//         }
//     })
//     return acumulador
// },[])

//console.log(categoriasUnicas)