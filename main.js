import express, { response } from 'express';
import config from 'config';
import { engine } from 'express-handlebars';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'),
});

const app = express();

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, req) => {
  req.render('index')
})

app.post('/', async (req, res) => {
  const prompt = req.body.prompt
  const size = req.body.size ?? '512x512'
  const number = req.body.number ?? 1

  try {
   const images =  await openai.images.generate({
      prompt,
      n: Number(number),
      size,
    })

    console.log(images.data)
    res.render('index',{
      images: images.data,
    })
  } catch (error) {
    res.render('index', {
      error: error.message
    })
    console.log(error.message)
  }

})

app.listen(3000, () => {
  console.log('server started...')
})