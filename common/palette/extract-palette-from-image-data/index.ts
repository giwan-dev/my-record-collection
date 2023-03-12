export function extractPaletteFromImageData(imageData: ImageData, id: string) {
  return new Promise<string[]>((resolve, reject) => {
    const worker = new Worker(new URL("./script.ts", import.meta.url));

    worker.onmessage = (
      event: MessageEvent<{ id: string; palette: string[] }>,
    ) => {
      if (event.data.id === id) {
        resolve(event.data.palette);
        worker.terminate();
      } else {
        reject(
          new Error(`ID Mismatch: expected: ${id}, received: ${event.data.id}`),
        );
      }
    };

    worker.postMessage({ id, imageData });
  });
}
