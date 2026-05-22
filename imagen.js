//Deteccion de imagenes

//La uRL describe las funcionalidades que deseamos aprovechar
  const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`

  //Imagen que analizaremos
  const imageURL = `https://images.pexels.com/videos/7655554/pexels-photo-7655554.jpeg`

  //Esta funcionalidad requiere ejecutarse como promesa
  async function analizarImagen(){
    try{
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Ocp-Apim-Subscription-Key": suscriptionKey,
          "Content-type": "application/json"
        },
        body: JSON.stringify({ url: imageURL})
      })

      if (!response.ok){
        const errorData = await response.json()
        throw new Error(`Error en: ${errorData.error.message}`)
      }

      //Logramos recibir un resultado favorable
      const data = await response.json()
      const confianza = (data.description.captions[0].confidence * 100).toFixed(2)

      //Muestra todos los datos
      //console.log(data.description)

      console.log("Descripcion: ", data.description.captions[0].text)
      console.log(`Confianza: ${confianza}%`)
      
      //join metodo que itera y concatena valores de un array
      console.log("Etiquetas: " + data.description.tags.join(", ")) 
      

    }catch (error){
      console.error(`Error analizando imagen: ${error.message}`)
    }
    
  }

  analizarImagen()
