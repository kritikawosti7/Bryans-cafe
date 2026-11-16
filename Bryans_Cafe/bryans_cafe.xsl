<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/cafe">
    <html lang="en-AU">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="brand" /> | Lunch</title>
        <link rel="stylesheet" href="bryans_cafe.css" />
      </head>
      <body id="top">
        <header class="masthead">
          <div class="masthead-copy">
            <p class="eyebrow">A neighbourhood table</p>
            <h1><xsl:value-of select="brand" /></h1>
            <p class="tagline"><xsl:value-of select="tagline" /></p>
            <p class="intro"><xsl:value-of select="introduction" /></p>
            <a class="menu-link" href="#lunch-menu">See the menu <span aria-hidden="true">&#8595;</span></a>
          </div>
          <figure class="food-figure">
            <img src="{media/image/@src}" alt="{media/image/@alt}" width="{media/image/@width}" height="{media/image/@height}" />
            <figcaption>Fresh from the kitchen, ready for the table.</figcaption>
          </figure>
        </header>
        <main>
          <section class="menu-section" id="lunch-menu" aria-labelledby="menu-title">
            <div class="section-heading">
              <p class="eyebrow">Served today</p>
              <h2 id="menu-title">The lunch menu</h2>
            </div>
            <div class="menu-grid">
              <xsl:for-each select="menu/item">
                <article class="dish">
                  <p class="dish-number"><xsl:number value="position()" format="01" /></p>
                  <div class="dish-heading">
                    <h3><xsl:value-of select="name" /></h3>
                    <xsl:choose>
                      <xsl:when test="@dietary = 'vegetarian'">
                        <span class="dietary vegetarian">Vegetarian</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="dietary contains-chicken">Contains chicken</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </div>
                  <p class="description"><xsl:value-of select="description" /></p>
                  <p class="price"><span class="currency"><xsl:value-of select="price/@currency" /></span> $<xsl:value-of select="price" /></p>
                </article>
              </xsl:for-each>
            </div>
          </section>
          <section class="sound-section" aria-labelledby="sound-title">
            <div>
              <p class="eyebrow">A moment at Bryan's</p>
              <h2 id="sound-title">A little lunch-hour pause.</h2>
            </div>
            <audio controls="controls" preload="metadata" aria-label="A short original cafe chime">
              <source src="{media/audio/@src}" type="{media/audio/@type}" />
              Your browser does not support audio playback.
            </audio>
          </section>
        </main>
        <footer>
          <p><xsl:value-of select="footer/copyright" /></p>
          <a href="#top" class="back-to-top">Back to top <span aria-hidden="true">&#8593;</span></a>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>