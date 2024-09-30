self.__uv$config = {
    prefix: "/&/daylight/",
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: "/&/uv.handler.js",
    client: "/&/uv.client.js",
    bundle: "/&/uv.bundle.js",
    config: "/&/uv.config.js",
    sw: "/&/uv.sw.js",
  };
  