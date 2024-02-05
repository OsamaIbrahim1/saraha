
export const findDocument = async (model, query) => {
  if (!model || !query) {
    return { mes: 'Invalid arguments', status: 400, success: false }
  }
  const isDocumentExists = await model.findOne(query)
  if (!isDocumentExists) {
    return { mes: 'document Not Found', status: 404, success: false }
  }
  return { mes: 'document Found', isDocumentExists, success: true }
}

export const createDocument = async (model, data) => {
  if (!model || !data) {
    return { message: 'Invalid arguments', status: 400, success: false }
  }
  const createdDocument = await model.create(data)
  if (!createdDocument) {
    return { mes: 'document Not created', status: 500, success: false }
  }
  return { mes: 'document Created', status: 201, success: true }
}
