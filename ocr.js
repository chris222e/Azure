require("dotenv").config()

const subscriptionKey = process.env.AZURE_KEY
const endpoint = process.env.AZURE_ENDPOINT

async function leerTextoURL() {

    const imageUrl =
        "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg"

    const response = await fetch(
        `${endpoint}vision/v3.2/read/analyze`,
        {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: imageUrl
            })
        }
    )

    const operationLocation =
        response.headers.get("operation-location")

    console.log("Procesando OCR...")

    let result

    while (true) {

        const poll = await fetch(operationLocation, {
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey
            }
        })

        result = await poll.json()

        if (result.status === "succeeded") {
            break
        }

        await new Promise(r => setTimeout(r, 1000))
    }

    console.log("\n===== TEXTO =====\n")

    result.analyzeResult.readResults.forEach(page => {

        page.lines.forEach(line => {
            console.log(line.text)
        })

    })
}

leerTextoURL()