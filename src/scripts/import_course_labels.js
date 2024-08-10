require('dotenv/config')
const fs = require('fs')
const { db } = require('../config/db')
const path = require('path')

function mapLabelsCourses(labels = []) {
  return labels.map(label => {
    return {
      label_id: label.id,
      title: label.title
    }
  })
}

async function getLabels() {
  const dirPath = path.join(__dirname,'..','..','tmp','labels')
  console.log({ dirPath })
  const labelFiles = fs.readdirSync(dirPath)
  for (const labelFile of labelFiles) {
    const labels = require(path.join(dirPath, labelFile))
    const fields = mapLabelsCourses(labels.results)
    await db('udemy_course_labels').insert(fields)
    console.log(`Inseridos ${fields.length}`)
  }
}


async function start() {
 
  process.exit(0)
}
getLabels()