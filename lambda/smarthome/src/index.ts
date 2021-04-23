export const handler = async (
  request: object | number | string | boolean | symbol | undefined | null,
  context: object | number | string | boolean | symbol | undefined | null
) => {
  console.log(request)
  console.log(context)
}
