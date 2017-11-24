# JavaScript Web Apps in Science

JavaScript is gaining traction in the scientific community as a simple and powerful language
to build engaging and interactive applications running only on the web browser. 

This page is a repository of simple examples that attempt to illustrate the potential of 'web apps'.
Click on the title of each example to see a live demo, or browse the repository for the code.

# List of Examples

## [Principal Component Analysis](pca/index.html)
Implementation of PCA for simple inspection of similarities and differences among complex datasets. Uses
the [LALOlib](http://mlweb.loria.fr/lalolab/lalolib.html) library for PCA and 
[Google Charts API](https://developers.google.com/chart/) for plotting.

## [Circular Dichroism of Proteins](circular-dichroism/index.html)
Tool to fit and simulate circular dichroism spectra of proteins. 
Pure JavaScript implementation of the algorithm described in this 
[publication](http://pubs.acs.org/doi/abs/10.1021/ed200060t)

## [Entrez API](entrez-api/index.html)
Very simple examples of retrieving records from PubMed from keywords and/or authors, using
the [Entrez API](https://www.ncbi.nlm.nih.gov/home/develop/api/) services. Further, it uses
[nlp-compromise](https://github.com/nlp-compromise/compromise) to extract terms from the abstracts.

## [Abstract Mutation Parser](mutation-parser/index.html)
Another example of using the Entrez API to retrieve abstracts and analyzing them for specific 
text patters, in this case mutations.

## [Augmented Reality Energy Calculation](arjs/index.html)
An example of the use of Augmented Reality to drive the interaction of two amino acids, while a simple
distance-dependent energy function is running in real-time. Uses [Three.js](https://threejs.org), 
[A-Frame](https://aframe.io) and [AR.js](https://github.com/jeromeetienne/AR.js/).

## [Voice-Aided Augmented Reality Energy Calculation](va-arjs/index.html)
Another example of Augmented Reality to perform interactive docking, integrating voice recognition to
activate/deactivate a force field to highlight certain interactions. Uses [annyang](https://www.talater.com/annyang/)
for voice recognition.

## [Molecular Viewer with Gaze Tracking ](webgazer/index.html)
Example of integration of gaze tracking and a molecular viewer. Uses [WebGazer.js](http://webgazer.cs.brown.edu/) to
track the user's eyes and [JSmol](http://jmol.sourceforge.net) to display the molecule.

# Code
The code for these examples is available at [the repository](http://github.com/labriata/jsinscience).

# Authors
[Luciano Abriata](https://github.com/labriata)
Ported to GitHub by [Joao Rodrigues](https://github.com/JoaoRodrigues)
