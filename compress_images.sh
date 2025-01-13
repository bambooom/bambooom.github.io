#!/bin/bash

# Bulk Image Compression Script
# Requirements: imagemagick installed (IMv7 or later)

# Set the source directory containing the images
SOURCE_DIR="${1:-.}"  # Default to current directory if no argument is passed

# Create the destination directory by appending '-compressed' to the source directory name
DEST_DIR="${SOURCE_DIR%/}-compressed"  # Remove trailing slash from SOURCE_DIR, if any, before appending

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Compression quality (adjust as needed)
QUALITY=60

echo "Starting compression in directory: $SOURCE_DIR"
echo "Compressed images will be saved to: $DEST_DIR"
echo "Compression quality set to: $QUALITY"

# Process .jpg and .png images
for img in "$SOURCE_DIR"/*.{jpg,jpeg,png}; do
  # Skip if no matching files are found
  [ -e "$img" ] || continue

  # Get the filename without the directory
  filename=$(basename "$img")
  compressed_img="$DEST_DIR/$filename"

  # Compress and save to the destination directory
  magick "$img" -quality $QUALITY "$compressed_img"

  # Compare file sizes
  original_size=$(stat -f%z "$img")
  compressed_size=$(stat -f%z "$compressed_img")
  if (( compressed_size < original_size )); then
    echo "Compressed: $filename (Reduced from $original_size bytes to $compressed_size bytes)"
  else
    echo "No significant compression achieved for: $filename"
  fi
done

echo "Image compression completed!"
