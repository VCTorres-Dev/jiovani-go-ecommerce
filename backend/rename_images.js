const fs = require("fs");
const path = require("path");

const damaDir = path.join(__dirname, "public/images/aroma_images");
const varonDir = path.join(__dirname, "public/images/Aroma_Varon_images");

const renameFiles = (dir, prefix) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach((file, index) => {
      const ext = path.extname(file);
      const newName = `${prefix}_${String(index + 1).padStart(2, "0")}${ext}`;
      const oldPath = path.join(dir, file);
      const newPath = path.join(dir, newName);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`Error renaming file ${oldPath} to ${newPath}:`, err);
        } else {
          console.log(`Renamed ${oldPath} to ${newPath}`);
        }
      });
    });
  });
};

renameFiles(damaDir, "dama");
renameFiles(varonDir, "varon");
