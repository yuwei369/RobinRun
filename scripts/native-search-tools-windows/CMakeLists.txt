cmake_minimum_required(VERSION 3.21)

cmake_policy(SET CMP0091 NEW)
project(robinrun_native_ugrep LANGUAGES C CXX)

if(NOT MSVC)
  message(FATAL_ERROR "RobinRun Windows ugrep must be built with MSVC")
endif()

foreach(source_name UGREP PCRE2 ZLIB BZIP2 ZSTD BROTLI)
  if(NOT DEFINED ROBINRUN_${source_name}_SOURCE_DIR)
    message(FATAL_ERROR "Missing ROBINRUN_${source_name}_SOURCE_DIR")
  endif()
endforeach()

if(NOT DEFINED ROBINRUN_UGREP_OUTPUT_DIR)
  message(FATAL_ERROR "Missing ROBINRUN_UGREP_OUTPUT_DIR")
endif()

set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)
set(BUILD_TESTING OFF CACHE BOOL "" FORCE)

# 随机构建目录不能进入最终 PE，否则同版本工具无法跨 CLI 复用同一份 runtime cache。
if(DEFINED ROBINRUN_BUILD_PATH)
  add_compile_options("/pathmap:${ROBINRUN_BUILD_PATH}=robinrun-native-search")
endif()

set(BUILD_STATIC_LIBS ON CACHE BOOL "" FORCE)
set(PCRE2_BUILD_PCRE2_8 ON CACHE BOOL "" FORCE)
set(PCRE2_BUILD_PCRE2_16 OFF CACHE BOOL "" FORCE)
set(PCRE2_BUILD_PCRE2_32 OFF CACHE BOOL "" FORCE)
set(PCRE2_BUILD_PCRE2GREP OFF CACHE BOOL "" FORCE)
set(PCRE2_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(PCRE2_SHOW_REPORT OFF CACHE BOOL "" FORCE)
set(PCRE2_STATIC_RUNTIME ON CACHE BOOL "" FORCE)
set(PCRE2_SUPPORT_JIT ON CACHE BOOL "" FORCE)
add_subdirectory("${ROBINRUN_PCRE2_SOURCE_DIR}" pcre2 EXCLUDE_FROM_ALL)

set(SKIP_INSTALL_ALL ON CACHE BOOL "" FORCE)
add_subdirectory("${ROBINRUN_ZLIB_SOURCE_DIR}" zlib EXCLUDE_FROM_ALL)

add_library(robinrun_bzip2 STATIC
  "${ROBINRUN_BZIP2_SOURCE_DIR}/blocksort.c"
  "${ROBINRUN_BZIP2_SOURCE_DIR}/huffman.c"
  "${ROBINRUN_BZIP2_SOURCE_DIR}/crctable.c"
  "${ROBINRUN_BZIP2_SOURCE_DIR}/randtable.c"
  "${ROBINRUN_BZIP2_SOURCE_DIR}/compress.c"
  "${ROBINRUN_BZIP2_SOURCE_DIR}/decompress.c"
  "${ROBINRUN_BZIP2_SOURCE_DIR}/bzlib.c"
)
target_compile_definitions(robinrun_bzip2 PRIVATE _CRT_SECURE_NO_WARNINGS)
target_include_directories(robinrun_bzip2 PUBLIC "${ROBINRUN_BZIP2_SOURCE_DIR}")

set(ZSTD_BUILD_CONTRIB OFF CACHE BOOL "" FORCE)
set(ZSTD_BUILD_PROGRAMS OFF CACHE BOOL "" FORCE)
set(ZSTD_BUILD_SHARED OFF CACHE BOOL "" FORCE)
set(ZSTD_BUILD_STATIC ON CACHE BOOL "" FORCE)
set(ZSTD_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(ZSTD_USE_STATIC_RUNTIME ON CACHE BOOL "" FORCE)
add_subdirectory("${ROBINRUN_ZSTD_SOURCE_DIR}/build/cmake" zstd EXCLUDE_FROM_ALL)

set(BROTLI_BUNDLED_MODE ON CACHE BOOL "" FORCE)
add_subdirectory("${ROBINRUN_BROTLI_SOURCE_DIR}" brotli EXCLUDE_FROM_ALL)

set(ROBINRUN_VIIZ_SOURCE_DIR "${ROBINRUN_UGREP_SOURCE_DIR}/lzma/C")
add_library(robinrun_viiz STATIC
  "${ROBINRUN_VIIZ_SOURCE_DIR}/viizip.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zAlloc.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zArcIn.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zBuf.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zBuf2.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zCrc.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zCrcOpt.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zDec.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zFile.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/7zStream.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Bcj2.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Bra.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Bra86.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/BraIA64.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/CpuArch.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Delta.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Lzma2Dec.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/LzmaDec.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Ppmd7.c"
  "${ROBINRUN_VIIZ_SOURCE_DIR}/Ppmd7Dec.c"
)
target_compile_definitions(robinrun_viiz PRIVATE
  Z7_PPMD_SUPPORT
  Z7_EXTRACT_ONLY
  NDEBUG
  _CRT_SECURE_NO_WARNINGS
)
target_include_directories(robinrun_viiz PUBLIC "${ROBINRUN_VIIZ_SOURCE_DIR}")

set(ROBINRUN_REFLEX_SOURCES
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/block_scripts.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/composer.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/convert.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/debug.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/error.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/input.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/language_scripts.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/letter_case.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/letter_scripts.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/matcher.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/pattern.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/posix.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/simd.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/unicode.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/lib/utf8.cpp"
)

add_library(robinrun_reflex STATIC ${ROBINRUN_REFLEX_SOURCES})
target_compile_definitions(robinrun_reflex PRIVATE WITH_NO_CODEGEN)

add_executable(ugrep
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/ugrep.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/cnf.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/glob.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/output.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/query.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/screen.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/stats.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/vkey.cpp"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src/zopen.c"
)

add_library(robinrun_ugrep_contract INTERFACE)
target_compile_definitions(robinrun_ugrep_contract INTERFACE
  HAVE_LIBBROTLI
  HAVE_LIBBZ2
  HAVE_LIBZ
  HAVE_LIBZSTD
  HAVE_PCRE2
  NDEBUG
  PCRE2_STATIC
  WITH_COLOR
  WITH_NO_INDENT
  _CONSOLE
  _CRT_NONSTDC_NO_WARNINGS
  _CRT_SECURE_NO_WARNINGS
)
if(CMAKE_GENERATOR_PLATFORM STREQUAL "ARM64")
  target_compile_definitions(robinrun_ugrep_contract INTERFACE HAVE_NEON)
else()
  target_compile_definitions(robinrun_ugrep_contract INTERFACE HAVE_SSE2)
endif()
target_compile_features(robinrun_ugrep_contract INTERFACE cxx_std_17)
# ugrep 固定源码是无 BOM UTF-8；中文 Windows 按 CP936 解析时会触发 C4819/C1070，并改写 UTF-8 字符串字面量。
target_compile_options(robinrun_ugrep_contract INTERFACE
  /utf-8
  $<$<COMPILE_LANGUAGE:CXX>:/EHsc>
)
target_include_directories(robinrun_ugrep_contract INTERFACE
  "${ROBINRUN_UGREP_SOURCE_DIR}/include"
  "${ROBINRUN_UGREP_SOURCE_DIR}/src"
  "${ROBINRUN_VIIZ_SOURCE_DIR}"
)

target_link_libraries(robinrun_reflex PRIVATE robinrun_ugrep_contract pcre2-8-static)
target_link_libraries(ugrep PRIVATE
  robinrun_ugrep_contract
  robinrun_reflex
  robinrun_viiz
  pcre2-8-static
  zlibstatic
  robinrun_bzip2
  libzstd_static
  brotlienc
  brotlidec
  brotlicommon
)
target_link_options(ugrep PRIVATE /Brepro)
set_target_properties(ugrep PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY "${ROBINRUN_UGREP_OUTPUT_DIR}"
  RUNTIME_OUTPUT_DIRECTORY_RELEASE "${ROBINRUN_UGREP_OUTPUT_DIR}"
)
